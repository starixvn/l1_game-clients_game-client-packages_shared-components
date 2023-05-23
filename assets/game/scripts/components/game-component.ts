import { Component, Game, Label, _decorator, game } from "cc";
import gc from "game-client-base";
import Observer from "observer";

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

    protected roundId = 0;
    protected settleStatus: gc.Settlements.SettlementStatusStore = null;

    protected onLoad(): void {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onJoinGame, this);
    }

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onJoinGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {}

    @handle(JoinGame.JoinGameHandler)
    onJoinGame() {}

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(Rounds.RoundStore, (store) => store.isEnableGame)
    handleJoinGame(isEnableGame: boolean) {
        isEnableGame && this.getJoinGameRoundState();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomInfo)
    handleJoinGameWhenShowResult(joinRoomInfo: gc.Rounds.TJoinRoomInfo) {
        const { joinGameState, roundHistory } = joinRoomInfo;
        if (
            (joinGameState === Rounds.ROUND_STATE.SHOW_ANIMATION_RESULT || joinGameState === Rounds.ROUND_STATE.SHOW_RESULT) &&
            roundHistory
        ) {
            this.roundId = roundHistory.roundId;
            this.setRoundId();
            this.showResult(roundHistory.result, false);
        }
    }

    @handle(Rounds.RoundUIHandlers.GetCurrentRoundState)
    getJoinGameRoundState() {}

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

    @render(Settlements.SettlementStatusStore, (store) => store)
    setSettlementStatus(settleStatus: gc.Settlements.SettlementStatusStore) {
        this.settleStatus = settleStatus;
    }

    @render(Settlements.SettlementStore, (store) => ({ roundId: store.roundId, result: store.result }))
    handleResult({ roundId, result }: { roundId: number; result: any }) {
        roundId && (this.roundId = roundId);
        this.showResult(result, true);
    }

    showResult(result: any, hasAnimation: boolean) {}

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
}
