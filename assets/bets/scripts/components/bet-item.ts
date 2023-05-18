import { _decorator, Component, Label, Node } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BetItemHandlers } from "../handlers/bet-item-handler";

const { render, handle } = Observer;

const { Rounds } = gc;

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
}
