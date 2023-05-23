import { _decorator, Component, Label, Node } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BetItemHandlers } from "../handlers/bet-item-handler";

const { render, handle } = Observer;

const { Rounds, RoundHistories, Settlements } = gc;

const { property } = _decorator;

export default class BetItem extends Component {
    @property(Label)
    lblOwnBet: Label = null;

    @property(Label)
    lblTotalBet: Label = null;

    @property(Label)
    lblOdds: Label = null;

    @property(Node)
    chipBox: Node = null;

    @property(Node)
    highlightBorder: Node = null;

    @property(Node)
    highlightBackground: Node = null;

    @property(Node)
    highlight: Node = null;

    lastRound: gc.RoundHistories.RoundHistory;
    settlementResult: gc.GameServiceMessage.TResult;

    onLoad() {
        this.lblOwnBet.string = "";
        this.lblTotalBet.string = "";
        this.lblOdds.string = "";
        this && this.setBetItem();
    }

    @handle(BetItemHandlers.SetBetItems)
    setBetItem() {
        return this;
    }

    @handle(gc.Bet.BetHandler, (handler, payload: string) => handler.handle(payload))
    onBet() {
        return this.node.name;
    }

    @render(Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        const { odds, fractional } = roundOdds;
        const choice = this.node.name;
        if (odds[choice]) {
            this.lblOdds.string = gc.FormatUtils.formatOdds(odds[choice], fractional);
        }
    }

    @render(Rounds.RoundStore, (store) => store.ownBets)
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        const choice = this.node.name;
        this.lblOwnBet.string = `${ownBets[choice] ? ownBets[choice] : ""}`;
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        const choice = this.node.name;
        this.lblTotalBet.string = `${totalBets[choice] ? totalBets[choice] : ""}`;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartGenerateResult)
    startGenerateResult(isStartGenerateResult: boolean) {
        if (isStartGenerateResult) {
            this.clearChips();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStopGame)
    public handleStopGame(isStopGame: boolean) {
        if (isStopGame) {
            this.clearChips();
        }
    }

    protected clearChips() {
        this.chipBox && this.chipBox.destroyAllChildren();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomInfo)
    handleJoinGame(joinRoomInfo: gc.Rounds.TJoinRoomInfo) {
        const { joinGameState, roundHistory } = joinRoomInfo;

        if (joinGameState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.setHighlight(false);
        }

        if (joinGameState === Rounds.ROUND_STATE.SHOW_ANIMATION_RESULT || joinGameState === Rounds.ROUND_STATE.SHOW_RESULT) {
            this.highlightWonBet(roundHistory.settlementResult, false);
        }
    }

    public setHighlight(highlight: boolean, isAnimated = true) {
        this.handleHighlight(highlight, isAnimated);
        this.handleHighlightBorder(highlight);
    }

    protected handleHighlight(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        if (this.highlightBackground) {
            this.highlightBackground.active = highlight && isAnimated;
        }
    }

    protected handleHighlightBorder(highlight: boolean) {
        if (this.highlightBorder) {
            this.highlightBorder.active = highlight;
        }
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult)
    handleResult(settlementResult: gc.GameServiceMessage.TResult) {
        if (settlementResult) {
            this.highlightWonBet(settlementResult, true);
            this.settlementResult = settlementResult;
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.histories)
    highlightLastResult(histories: gc.RoundHistories.RoundHistory[]) {
        this.lastRound = histories[0];
        if (!this.lastRound) {
            return;
        }

        this.highlightWonBet(this.lastRound.settlementResult, false);
    }

    highlightWonBet(settlementResult: gc.GameServiceMessage.TResult, isAnimated = true) {
        const choice = this.node.name;
        if (settlementResult[choice]) {
            this.setHighlight(true, isAnimated);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    resetHighlightWhenStartRound(isStartingRound: boolean) {
        isStartingRound && this.settlementResult && this.highlightWonBet(this.settlementResult, false);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    resetHighlightBlockBet(isLocking: boolean) {
        if (isLocking) {
            this.setHighlight(false);
        }
    }
}
