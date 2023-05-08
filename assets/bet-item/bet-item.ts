import { _decorator, Component, Label } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { observer, render, handle } = Observer;

const { Rounds } = gc;

const { ccclass, property } = _decorator;

export default class BetItem extends Component {
    @property(Label)
    lblOwnBet: Label = null;

    @property(Label)
    lblTotalBet: Label = null;

    @property(Label)
    lblOdds: Label = null;

    onLoad() {
        this.lblOwnBet.string = "";
        this.lblTotalBet.string = "";
        this.lblOdds.string = "";
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
    renderOwnBets(ownBets: any) {
        const choice = this.node.name;
        if (ownBets[choice]) {
            this.lblOwnBet.string = `${ownBets[choice]}`;
        }
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: any) {
        const choice = this.node.name;
        if (totalBets[choice]) {
            this.lblTotalBet.string = `${totalBets[choice]}`;
        }
    }
}
