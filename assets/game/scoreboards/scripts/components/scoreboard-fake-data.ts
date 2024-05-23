import { _decorator, Component } from "cc";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardDerived } from "./scoreboard-derived";

const { ccclass, property } = _decorator;

@ccclass
export class RenderFakeData extends Component {
    @property(Scoreboard)
    protected bigRoad: Scoreboard = null;

    @property(Scoreboard)
    protected beadRoad: Scoreboard = null;

    @property(ScoreboardDerived)
    protected derived: ScoreboardDerived = null;

    protected results = [];

    onLoad(): void {
        this.schedule(() => {
            this.render();
            this.scheduleOnce(this.renderBlinkNode, 1);
        }, 3);
    }

    render() {
        const value = (Math.random() * 9) >> 0; //NOSONAR
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
        this.derived?.render(this.results);
    }

    renderBlinkNode() {
        const converter = this.bigRoad.getComponent(ScoreboardDataConverter);
        const round = converter.createRound();
        const lastResult = converter.convert(this.results[this.results.length - 1])?.[converter.keyOfA];
        round[converter.resultKey][converter.keyOfA] = lastResult;
        round[converter.resultKey][converter.blinkKey] = true;
        const rounds = [...this.results, round];
        this.bigRoad?.render(rounds);
        this.derived?.render(this.results, true);
    }
}
