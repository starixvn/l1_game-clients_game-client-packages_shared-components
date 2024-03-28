import gc from "@sg/game-client-base";
import { _decorator, Node, Tween, tween, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { Settlements, Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class ScoreboardCollapseExpandContent extends ObserverComponent {
    @property(Node)
    nodeArrow: Node = null;

    private tween: Tween<Node> = null;

    private isCollapse = false;
    private readonly POSITION_COLLAPSE = 527;
    private readonly POSITION_EXPAND = 371;

    onClickPercent() {
        this.isCollapse = !this.isCollapse;
        this.isCollapse
            ? this.animChangePositon(this.node, this.POSITION_COLLAPSE)
            : this.animChangePositon(this.node, this.POSITION_EXPAND);
        this.nodeArrow.active = this.isCollapse;
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    collapseScoreboard() {
        this.animChangePositon(this.node, this.POSITION_COLLAPSE);
        this.nodeArrow.active = true;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    expandScoreboard() {
        this.animChangePositon(this.node, this.POSITION_EXPAND);
        this.nodeArrow.active = false;
    }

    animChangePositon(node: Node, y: number) {
        this.tween && this.tween.stop();
        this.tween = tween(node)
            .to(0.5, { position: v3(500, y, 0) })
            .start();
    }
}
