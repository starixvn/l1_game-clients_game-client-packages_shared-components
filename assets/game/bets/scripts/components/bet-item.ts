import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";
import Observer from "observer";
import { BetItemStore, TBetStartingRound } from "../stores/bet-item-store";

const { render, handle } = Observer;

const { Rounds, RoundHistories } = gc;

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
    }

    get betChoice() {
        return this.node.name;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @handle(gc.Bet.BetHandler, (handler, payload: string) => handler.handle(payload))
    onBet() {
        this.playSoundClick();
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
        if (ownBets?.[choice]) {
            this.lblOwnBet.string = gc.FormatUtils.numberWithCommas(ownBets[choice]);
        } else {
            this.lblOwnBet.string = "";
        }
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        const choice = this.node.name;
        if (totalBets?.[choice]) {
            this.lblTotalBet.string = gc.FormatUtils.numberWithCommas(totalBets[choice]);
        } else {
            this.lblTotalBet.string = "";
        }
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

    @render(RoundHistories.RoundHistoryStore, (store) => store.highLightInfo)
    handleJoinGame(highLightInfo: gc.RoundHistories.THighLightInfo) {
        const { roundHistory, isHighLightAnim, isResetHighlight } = highLightInfo;
        if (isHighLightAnim) {
            this.highlightWonBet(roundHistory?.settlementResult, true);
        } else {
            this.highlightWonBet(roundHistory?.settlementResult, false);
        }

        if (isResetHighlight) {
            this.setHighlight(false);
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

    highlightWonBet(settlementResult: gc.GameServiceMessage.TSettlementResult, isAnimated = true) {
        const choice = this.node?.name ?? "";
        this.setHighlight(settlementResult?.[choice], isAnimated);
    }

    @render(BetItemStore, (store) => store.getBetStartingRoundInfo)
    resetHighlightWhenStartRound(betStartingRound: TBetStartingRound) {
        const { isStartingRound, settlementResult } = betStartingRound;
        isStartingRound && this.highlightWonBet(settlementResult, false);
    }
}
