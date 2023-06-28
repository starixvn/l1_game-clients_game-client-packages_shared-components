import gc from "@sg/game-client-base";
import { Game, Label, _decorator, director, game, log } from "cc";
import Observer from "observer";
import { InGameMenuEvents } from "../../../game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../game/in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import WebViewGuide from "../../game-guide/scripts/web-view-guide";
import { LogStore } from "../stores/log-store";
import { GameComponentBase } from "./game-component-base";

const { Rounds, Connection, HideGame, Settlements, FormatUtils, RoundHistories } = gc;
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;

@ccclass
export default class GameComponent extends GameComponentBase {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblMinBet: Label = null;

    @property(Label)
    lblMaxBet: Label = null;

    @property(NodeContainer)
    guideContainer: NodeContainer = null;

    containerOptions: gc.IContainerOptions;

    onLoad() {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
        this.initUserSettings();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.App.AppStore, (store) => store.isUM)
    loadUMScene(isUM: boolean) {
        isUM && director.loadScene("under-maintenance");
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {}

    @handle(gc.UserSettings.UserSettingHandlers, (handle) => handle.loadStorages())
    initUserSettings() {}

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {
        log("Game run in background ============================================");
    }

    onShowGame() {
        log("Game run in foreground ============================================");
        // TODO: Temporary reset
        window.location.reload();
    }

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomShowResult)
    handleJoinGameAndShowResult(joinRoomShowResult: gc.RoundHistories.IRoundHistoryInfo) {
        const { roundHistory, isShow } = joinRoomShowResult ?? {};
        if (roundHistory && isShow) {
            this.showResult(roundHistory?.result, false);
        }
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(roundId: number) {
        this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @render(Settlements.SettlementStore, (store) => ({ roundId: store.roundId, result: store.result }))
    handleResult({ roundId, result }: { roundId: number; result: gc.GameServiceMessage.TResult }) {
        this.showResult(result, true);
        this.playSoundReceiveFinish();
    }

    showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {}

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundReceiveFinish() {
        return gc.Audios.AudioIds.RECEIVE_FINISH;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartGenerateResult)
    startGenerateResult(isStartGenerateResult: boolean) {}

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_GUIDE) {
            const guide = this.guideContainer.createNode();
            guide.getComponent(WebViewGuide)?.initUrl();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.playSoundStartPlacingBet();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundStartPlacingBet() {
        return gc.Audios.AudioIds.START_PLACING_BET;
    }
}
