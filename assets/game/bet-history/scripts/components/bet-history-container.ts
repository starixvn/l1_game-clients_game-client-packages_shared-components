import { Node } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";
import { BetHistoryTable } from "./bet-history-table";

const { render } = Observer;
const { BetHistory } = gc;

export class BetHistoryContainer extends NodeContainer {
    wrapperNode: Node = null;

    getHistoryTableComponent() {
        return this.wrapperNode.getComponentInChildren(BetHistoryTable);
    }

    @render(BetHistory.BetHistoryStore, (store) => store.data, { fireImmediately: false })
    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
        }

        this.getHistoryTableComponent().showBetHistory(model);
    }
}
