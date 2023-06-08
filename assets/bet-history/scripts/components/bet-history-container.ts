import { Prefab, _decorator, Node, instantiate } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../node-container/node-container";
import BetHistoryBodyItem from "./bet-history-body-item";
import { BetHistoryTable } from "./bet-history-table";

const { render } = Observer;

const { BetHistory } = gc;
const { ccclass, property } = _decorator;

@ccclass("BetHistoryContainer")
export class BetHistoryContainer extends NodeContainer {
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

    @render(BetHistory.BetHistoryStore, (store) => store.data, { fireImmediately: false })
    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        const table = this.createNode().getComponent(BetHistoryTable);

        table.header.addChild(instantiate(this.headerPrefab));
        model.betLogs.forEach((ticket, index) => {
            table.body.addChild(this.buildBodyRow(ticket, index));
        });
    }
}
