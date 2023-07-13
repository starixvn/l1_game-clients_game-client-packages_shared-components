import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { IBetDetailLog } from "./stores/bet-detail-store";
import BetDetailBodyItem from "./bet-detail-body-item";

const { ccclass, property } = _decorator;

export interface IBetHistoryTable {
    showBetHistory(model: gc.BetHistory.BetHistoryModel): void;
}

@ccclass()
export class BetDetailTable extends Component {
    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    getBetDetailItemComponent(node: Node) {
        return node.getComponent(BetDetailBodyItem);
    }

    buildBodyRow(betLogItem: IBetDetailLog, index: number): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getBetDetailItemComponent(bodyRow)?.setData(betLogItem, index);
        return bodyRow;
    }

    showBetDetail(betDetailLogs: Array<IBetDetailLog>) {
        // this.clearOldTable();

        // this.header.addChild(instantiate(this.headerPrefab));
        betDetailLogs.forEach((item, index) => {
            this.body.addChild(this.buildBodyRow(item, index));
        });
    }

    clearOldTable() {
        // this.header.destroyAllChildren();
        // this.body.destroyAllChildren();
    }
}
