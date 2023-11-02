import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../../../shared/common-components/node-container/node-container";
import { BetDetailTable } from "./bet-detail-table";

const { ccclass } = _decorator;
const { render } = Observer;
const { BetHistory } = gc;

@ccclass("BetDetailContainer")
export class BetDetailContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: BetDetailTable = null;

    @render(BetHistory.BetDetailHitoryStore, (store) => store.model, { fireImmediately: false })
    showBetDetailPopup(model: gc.BetHistory.BetDetailModel) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetDetailTable);
        }

        this.table?.showBetDetail(model);
    }
}
