import gc from "@sg/game-client-base";
import { Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { RoundHistoryItem } from "./round-history-item";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { FormatUtils, Rounds, Settlements } = gc;

@ccclass
export class StatisticsBar extends ObserverComponent {
    @property(Prefab)
    prbStatisticsItem: Prefab = null;

    @property(Node)
    content: Node = null;

    protected rounds: gc.RoundHistories.RoundHistory[] = [];

    @render(gc.GameCrash.RoundHistory.CrashRoundHistoryStore, (store) => store.roundHistories, { fireImmediately: false })
    setRoundsInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.rounds = rounds;
        this.updateStatisticsBarInfo(rounds);
    }

    private updateStatisticsBarInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        if (this.rounds.length === 0) {
            return;
        }
        this.content.destroyAllChildren();
        rounds.forEach((round, index) => {
            if (index > 10) {
                return;
            }
            const node = instantiate(this.prbStatisticsItem);
            const control = node.getComponent(RoundHistoryItem);
            control.roundInfo = round;
            control.updateMultiplierValue(+round.result, "statistics-bar");
            this.content.addChild(node);
        });
    }
}
