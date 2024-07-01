import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { Scoreboard } from "./scoreboard";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { ScoreboardDerived } from "./scoreboard-derived";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class ScoreboardDataReceiver extends ObserverComponent {
    @property({ type: Scoreboard })
    scoreboards: Scoreboard[] = [];

    protected lastRound: unknown = {};
    protected rounds: unknown[] = [];

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public render<T>(rounds: T[]) {
        if (!rounds) {
            return;
        }
        const reversedRounds = [...rounds].reverse();

        this.rounds = reversedRounds;
        this.scoreboards.forEach((scoreboard) => {
            scoreboard.render([...reversedRounds]);
        });
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

        const converter = this.scoreboards[0].getComponent(ScoreboardDataConverter);
        const round = converter.createRound();
        if (this.rounds.length > 0) {
            const lastResult = converter.convert(this.rounds[this.rounds.length - 1])?.[converter.keyOfA];
            round[converter.resultKey][converter.keyOfA] = lastResult;
        } else {
            round[converter.resultKey][converter.keyOfA] = true;
        }

        round[converter.resultKey][converter.blinkKey] = true;
        const rounds = [...this.rounds, round];

        this.scoreboards.forEach((scoreboard) => {
            const derivedScoreboard = scoreboard.getComponent(ScoreboardDerived);
            if (derivedScoreboard) {
                derivedScoreboard.render(this.rounds, true);
            } else {
                scoreboard.render(rounds);
            }
        });
    }
}
