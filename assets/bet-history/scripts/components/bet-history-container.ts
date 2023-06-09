import { Prefab, _decorator, Node, instantiate } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../node-container/node-container";
import BetHistoryBodyItem from "./bet-history-body-item";
import { BetHistoryTable } from "./bet-history-table";

const { render } = Observer;

const { BetHistory } = gc;
const { property } = _decorator;

export class BetHistoryContainer extends NodeContainer {
    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    wrapperNode: Node = null;
    table: any = null;

    getHistoryItemComponent(node: Node) {
        return node.getComponent(BetHistoryBodyItem);
    }

    buildBodyRow(ticket: any, index: number): Node {
        return null;
    }

    // @render(BetHistory.BetHistoryStore, (store) => store.showBetHistory, { fireImmediately: false })
    // checkExistedBetHistory(model: gc.BetHistory.BetHistoryStore) {
    //     if (model.showBetHistory) {
    //         this.wrapperNode = this.createNode();
    //     }
    // }

    @render(BetHistory.BetHistoryStore, (store) => store.data, { fireImmediately: false })
    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        if (this.wrapperNode && this.wrapperNode.active) {
            this.table.header.destroyAllChildren();
            this.table.body.destroyAllChildren();
        } else {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetHistoryTable);
        }

        this.table.header.addChild(instantiate(this.headerPrefab));
        model.betLogs.forEach((ticket, index) => {
            this.table.body.addChild(this.buildBodyRow(ticket, index));
        });
    }
}
