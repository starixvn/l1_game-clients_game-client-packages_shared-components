import { _decorator, Component, Label, Node } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BetItemHandlers } from "../handlers/bet-item-handler";
import { BetItemStore, TBetStartingRound } from "../stores/bet-item-store";

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
        this.lblOwnBet.string = `${ownBets?.[choice] ? ownBets?.[choice] : ""}`;
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        const choice = this.node.name;
        this.lblTotalBet.string = `${totalBets?.[choice] ? totalBets?.[choice] : ""}`;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartGenerateResult)
    startGenerateResult(isStartGenerateResult: boolean) {
        isStartGenerateResult && this.clearChips();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStopGame)
    handleStopGame(isStopGame: boolean) {
        isStopGame && this.clearChips();
    }

    protected clearChips() {
        this.chipBox?.destroyAllChildren();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomHighLight)
    handleJoinGame(joinRoomHighLight: gc.RoundHistories.TJoinRoomHighLight) {
        const { isJoinRoom, roundHistory, isHighLightBetWon } = joinRoomHighLight;
        if (isJoinRoom) {
            if (isHighLightBetWon) {
                this.highlightWonBet(roundHistory?.settlementResult, false);
            } else {
                this.setHighlight(false);
            }
        }
    }

    protected setHighlight(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        this.handleHighlightBackground(highlight, isAnimated);
        this.handleHighlightBorder(highlight);
    }

    protected handleHighlightBackground(highlight: boolean, isAnimated = true) {
        this.highlightBackground && (this.highlightBackground.active = highlight && isAnimated);
    }

    protected handleHighlightBorder(highlight: boolean) {
        this.highlightBorder && (this.highlightBorder.active = highlight);
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult, { fireImmediately: false })
    handleResult(settlementResult: gc.GameServiceMessage.TResult) {
        settlementResult && this.highlightWonBet(settlementResult, true);
    }

    highlightWonBet(settlementResult: gc.GameServiceMessage.TResult, isAnimated = true) {
        const choice = this.node?.name ?? "";
        this.setHighlight(settlementResult[choice], isAnimated);
    }

    @render(BetItemStore, (store) => store.getBetStartingRoundInfo)
    resetHighlightWhenStartRound(betStartingRound: TBetStartingRound) {
        const { isStartingRound, settlementResult } = betStartingRound;
        isStartingRound && this.highlightWonBet(settlementResult, false);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    resetHighlightBlockBet(isLocking: boolean) {
        isLocking && this.setHighlight(false);
    }
}
