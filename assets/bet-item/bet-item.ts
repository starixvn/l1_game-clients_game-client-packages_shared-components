import { _decorator, Component, Label, Node } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { SlidingChipHandler } from "../sliding-chip/scripts/handlers/sliding-chip-handler";

const { render, handle } = Observer;

const { Rounds, Chips } = gc;

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

    @render(Chips.ChipStore, (store) => store.ownChip)
    placeOwnChip(ownChip: gc.GameServiceMessage.OwnChip) {
        const { betChoice, amount } = ownChip;
        const choice = this.node.name;
        betChoice === choice && this.flyChip(this.chipBox, amount);
    }

    @handle(SlidingChipHandler.FlyChip)
    flyChip(chipBox: Node, amount: number) {
        return { chipBox, amount };
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    public clearBet(isStartingRound: boolean) {
        if (isStartingRound && this.chipBox) {
            this.clearChips();
        }
    }

    protected clearChips() {
        this.chipBox.destroyAllChildren();
    }
}
