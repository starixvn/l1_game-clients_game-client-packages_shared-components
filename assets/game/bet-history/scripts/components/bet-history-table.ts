import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import BetHistoryBodyItem from "./bet-history-body-item";

const { ccclass, property } = _decorator;

type BetHistoryTableType = {
    data: gc.BetHistory.BetHistoryModel;
    headerPrefab: Prefab;
    bodyItemPrefab: Prefab;
    resultPrefab: Prefab;
};

@ccclass()
export class BetHistoryTable extends Component {
    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    getHistoryItemComponent(node: Node) {
        return node.getComponent(BetHistoryBodyItem);
    }

    buildBodyRow(bodyItemPrefab: Prefab, betHistoryLog: gc.BetHistory.BetHistoryLog, index: number, resultPrefab: Prefab): Node {
        const bodyItem = instantiate(bodyItemPrefab);
        this.getHistoryItemComponent(bodyItem)?.setData({
            betHistoryLog,
            index,
            resultPrefab,
        });
        return bodyItem;
    }

    showBetHistory(model: BetHistoryTableType) {
        const { data, headerPrefab, bodyItemPrefab, resultPrefab } = model;
        this.clearOldTable();

        this.header.addChild(instantiate(headerPrefab));
        data.betLogs.forEach((betLogItem, index) => {
            this.body.addChild(this.buildBodyRow(bodyItemPrefab, betLogItem, index, resultPrefab));
        });
    }

    clearOldTable() {
        this.header.destroyAllChildren();
        this.body.destroyAllChildren();
    }
}
