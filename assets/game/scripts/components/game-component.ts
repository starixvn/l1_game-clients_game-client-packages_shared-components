import { Component, Game, Label, _decorator, game } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { UpdatingBalanceContainer } from "../../../balance-effect/scripts/updating-balance-container";
import { WinningEffectContainer } from "../../../balance-effect/scripts/winning-effect-container";
import UserProfile from "../../../user-profile/scripts/user-profile";

const { Auth, Rounds, Connection, HideGame, JoinGame, Settlements, FormatUtils, RoundHistories } = gc;
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

    @property(UserProfile)
    userProfile: UserProfile = null;

    @property(WinningEffectContainer)
    winningEffectContainer: WinningEffectContainer = null;

    @property(UpdatingBalanceContainer)
    updatingBalanceContainer: UpdatingBalanceContainer = null;

    protected roundId = 0;
    protected settleStatus: gc.Settlements.SettlementStatusStore = null;
    protected roundHistories: gc.RoundHistories.RoundHistory[] = [];
    protected isFirstLoad = true;

    protected onLoad(): void {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onJoinGame, this);
    }
    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onJoinGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {
        console.log("onGameHide");
    }

    @handle(JoinGame.JoinGameHandler)
    onJoinGame() {
        console.log("onGameShow");
    }

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(Rounds.RoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    handleJoinGame(roundState: string) {
        if (this.isFirstLoad) {
            this.isFirstLoad = false;
            this.getJoinGameRoundState();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.joinGameState, { fireImmediately: false })
    handleJoinGameWhenShowResult(roundState: string) {
        if (
            (roundState === Rounds.ROUND_STATE.SHOW_ANIMATION_RESULT || roundState === Rounds.ROUND_STATE.SHOW_RESULT) &&
            this.roundHistories[0]
        ) {
            const lastRound = this.roundHistories[0];
            this.roundId = lastRound.roundId;
            this.setRoundId();
            this.showResult(lastRound.result, false);
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

    @render(RoundHistories.RoundHistoryStore, (store) => store.histories)
    setRoundHistories(histories: gc.RoundHistories.RoundHistory[]) {
        this.roundHistories = histories;
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

    payChips() {
        // dealer get chips and pay chips
        this.payChipToAllPlayers();
    }

    payChipToAllPlayers() {
        if (this.settleStatus.win) {
            this.showPayoutForLoginPlayer();
        }
    }

    showPayoutForLoginPlayer() {
        this.updatingBalanceContainer?.updateBalance(this.userProfile.node, true, this.settleStatus.bet);
        this.winningEffectContainer?.playWinningEffect();
        this.getBalance();
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

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
