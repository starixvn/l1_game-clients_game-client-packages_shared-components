import { _decorator, instantiate, Node, Prefab } from "cc";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import BetHistoryBodyItem from "./bet-history-body-item";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;
@ccclass()
export class BetHistoryTable extends ObserverComponent {
    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    getHistoryItemComponent(node: Node) {
        return node.getComponent(BetHistoryBodyItem);
    }

    buildBodyRow(ticket: any, index: number): Node {
        return null;
    }

    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        this.clearOldTable();

        this.header.addChild(instantiate(this.headerPrefab));
        model.betLogs.forEach((ticket, index) => {
            this.body.addChild(this.buildBodyRow(ticket, index));
        });
    }

    clearOldTable() {
        this.header.destroyAllChildren();
        this.body.destroyAllChildren();
    }
}
