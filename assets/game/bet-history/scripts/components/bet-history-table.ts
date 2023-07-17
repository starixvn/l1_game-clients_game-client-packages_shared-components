import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import BetHistoryBodyItem from "./bet-history-body-item";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;

export interface IBetHistoryTable {
    showBetHistory(model: gc.BetHistory.BetHistoryModel): void;
}

@ccclass()
export class BetHistoryTable extends Component {
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

    buildBodyRow(betLogItem: gc.BetHistory.IBetHistoryLog, index: number, fractionalOddsFormat: boolean): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getHistoryItemComponent(bodyRow)?.setData(betLogItem, index, fractionalOddsFormat);
        return bodyRow;
    }

    showBetHistory(model: gc.BetHistory.BetHistoryModel, fractionalOddsFormat: boolean) {
        this.clearOldTable();

        this.header.addChild(instantiate(this.headerPrefab));
        model.betLogs.forEach((betLogItem, index) => {
            this.body.addChild(this.buildBodyRow(betLogItem, index, fractionalOddsFormat));
        });
    }

    clearOldTable() {
        this.header.destroyAllChildren();
        this.body.destroyAllChildren();
    }
}
