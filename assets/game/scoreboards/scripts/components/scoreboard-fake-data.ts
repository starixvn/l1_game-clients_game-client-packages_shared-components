import { _decorator, Component } from "cc";
import { Scoreboard } from "./scoreboard";

const { ccclass, property } = _decorator;

@ccclass
export class RenderFakeData extends Component {
    @property(Scoreboard)
    protected bigRoad: Scoreboard = null;

    @property(Scoreboard)
    protected beadRoad: Scoreboard = null;

    protected results = [];

    onLoad(): void {
        this.schedule(() => this.render(), 1);
    }

    render() {
        const value = (Math.random() * 9) >> 0;
        const isBanker = value < 2;
        const isTie = value >= 8;

        const result = {
            banker: isBanker,
            tie: isTie,
        };

        const round = { settlementResult: result };

        if (this.results.length < 102) {
            this.results.push(round);
        } else {
            this.results.shift();
            this.results.push(round);
        }

        this.bigRoad?.render(this.results);
        this.beadRoad?.render(this.results);
    }
}
