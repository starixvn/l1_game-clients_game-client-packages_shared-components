import { Component, Game, Label, _decorator, director, game, log } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { InGameMenuEvents } from "../../../game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../game/in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import WebViewGuide from "../../game-guide/scripts/web-view-guide";

const { Rounds, Connection, HideGame, JoinGame, Settlements, FormatUtils, RoundHistories } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class GameComponent extends Component {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblMinBet: Label = null;

    @property(Label)
    lblMaxBet: Label = null;

    @property(NodeContainer)
    guideContainer: NodeContainer = null;

    protected roundId = 0;

    protected onLoad(): void {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
    }

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {
        log("Game run in background ============================================");
    }

    refreshContainer() {}

    onShowGame() {
        log("Game run in foreground ============================================");
        this.refreshContainer();
        director.loadScene("game");
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
            this.roundId = roundHistory?.roundId;
            this.setRoundId();
            this.showResult(roundHistory?.result, false);
        }
    }

    @render(Rounds.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @handle(Rounds.RoundUIHandlers.SetRoundId)
    setRoundId() {
        return this.roundId;
    }

    @render(Settlements.SettlementStore, (store) => ({ roundId: store.roundId, result: store.result }))
    handleResult({ roundId, result }: { roundId: number; result: gc.GameServiceMessage.TResult }) {
        roundId && (this.roundId = roundId);
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
    startGenerateResult(isStartGenerateResult: boolean) {
        if (isStartGenerateResult) {
            this.finishedSettlement();
            this.resetForNewRound();
            this.roundId++;
            this.setRoundId();
        }
    }

    @handle(Settlements.SettlementUIHandlers.FinishedSettlement)
    finishedSettlement() {}

    @handle(Rounds.RoundUIHandlers.ResetRoundStore)
    resetForNewRound() {}

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
