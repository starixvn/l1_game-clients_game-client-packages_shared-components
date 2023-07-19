import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class ScoreboardDataReceiver extends ObserverComponent {
    @property(Scoreboard)
    protected bigRoad: Scoreboard = null;

    @property(Scoreboard)
    protected beadRoad: Scoreboard = null;

    protected lastRound: unknown = {};
    protected rounds: unknown[] = [];

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public render<T>(rounds: T[]) {
        const reversedRounds = [...rounds].reverse();

        this.rounds = reversedRounds;

        this.bigRoad?.render([...reversedRounds]);
        this.beadRoad?.render([...reversedRounds]);
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.getLastRound())
    public setLastRound(round: unknown) {
        this.lastRound = round;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isLocking)
    public toggleBlinkNode(active: boolean) {
        if (!active) {
            return;
        }
        if (this.bigRoad) {
            const converter = this.bigRoad.getComponent(ScoreboardDataConverter);
            const round = converter.createRound();
            const lastResult = converter.convert(this.lastRound)?.[converter.keyOfA];

            round[converter.resultKey][converter.keyOfA] = lastResult;
            round[converter.resultKey][converter.blinkKey] = true;

            const rounds = [...this.rounds];

            rounds.push(round);
            this.bigRoad.render(rounds);
        }
        if (this.beadRoad) {
            const converter = this.beadRoad.getComponent(ScoreboardDataConverter);
            const round = converter.createRound();
            round[converter.resultKey][converter.blinkKey] = true;

            const rounds = [...this.rounds];
            const setting = this.beadRoad.getComponent(GridLayout).settings;
            const { row, column } = setting;

            rounds.length === row * column && rounds.shift();
            rounds.push(round);
            this.beadRoad.render(rounds);
        }
    }
}
