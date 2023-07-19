import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
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

    @render(gc.Rounds.RoundStore, (store) => store.isAnimBlink)
    public toggleBlinkNode(isAnimBlink: boolean) {
        if (isAnimBlink && this.bigRoad) {
            const converter = this.bigRoad.getComponent(ScoreboardDataConverter);
            const round = converter.createRound();
            const lastResult = converter.convert(this.lastRound)?.[converter.keyOfA];

            round[converter.resultKey][converter.keyOfA] = lastResult;
            round[converter.resultKey][converter.blinkKey] = true;

            this.rounds.push(round);
            this.bigRoad.render(this.rounds);
        }
    }
}
