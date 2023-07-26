import gc from "@sg/game-client-base";
import { Game, Label, _decorator, director, game } from "cc";
import Observer from "observer";
import { InGameMenuEvents } from "../../../game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../game/in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { StaticNode } from "../../../shared/common-components/static-node/scripts/static-node";
import { StaticNodeGroupId } from "../../../shared/common-components/static-node/scripts/static-node-info";
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
    lblList = [];
    onLoad() {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
        this.initUserSettings();
        this.initPlayerSelections();
        this.lblList.push(this?.lblRoundId, this?.lblMinBet, this?.lblMaxBet);
        this.handleStaticNode();
        this.handleLblFirstLoad();
    }

    protected handleStaticNode() {
        this.lblList.forEach((label) => {
            if (label) {
                const component = label?.addComponent(StaticNode);
                component && (component.groupId = StaticNodeGroupId.TextContainer);
            }
        });
    }

    protected handleLblFirstLoad() {
        this.lblList.forEach((label) => {
            if (label) {
                label.string = "";
                label.cacheMode = Label.CacheMode.CHAR;
            }
        });
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.App.AppStore, (store) => store.isUM)
    loadUMScene(isUM: boolean) {
        isUM && director.loadScene("under-maintenance");
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.name)
    logLoadScene(gameName: string) {
        console.log(`LoadScene ${gameName}`);
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {}

    @handle(gc.UserSettings.UserSettingHandlers, (handle) => handle.loadStorages())
    initUserSettings() {}

    @handle(gc.PlayerSelections.PlayerSelectionHandlers.InitHandlers)
    initPlayerSelections() {}

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {}

    onShowGame() {
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
        roundId > 0 && this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }), {
        fireImmediately: false,
    })
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result, settlementResult } = data;
        if (!result || !settlementResult) {
            return;
        }
        this.showResult(result, true).then(() => {
            this.finishShowResult(settlementResult);
        });
        this.playSoundReceiveFinish();
    }
    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {}

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundReceiveFinish() {
        return gc.Audios.AudioIds.RECEIVE_FINISH;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    handleStartRound(isStartRound: boolean) {}

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
