import gc from "@sg/game-client-base";
import { _decorator, Node, Widget } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { Settlements, Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class ScoreboardCollapseExpandContent extends ObserverComponent {
    @property(Node)
    bigRoad: Node = null;

    @property(Node)
    line: Node = null;

    private isCollapse = false;
    private readonly TOP_HEIGHT_WIDGET = 20;

    onClickPercent() {
        this.isCollapse = !this.isCollapse;
        this.setDisplayScoreboard(this.isCollapse);
    }

    setDisplayScoreboard(isCollapse: boolean) {
        this.bigRoad.active = !isCollapse;
        this.line.active = !isCollapse;
        this.node.getComponent(Widget).top = isCollapse ? 0 : this.TOP_HEIGHT_WIDGET;
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    collapseScoreboard() {
        this.setDisplayScoreboard(true);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    expandScoreboard() {
        this.setDisplayScoreboard(false);
    }
}
