import { Node, _decorator } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../../../shared/common-components/node-container/node-container";
import { BetDetailTable } from "./bet-detail-table";
import { BetDetailStore, IBetLog } from "./stores/bet-detail-store";

const { ccclass } = _decorator;
const { render, handle, observer } = Observer;
const { BetHistory } = gc;

@ccclass("BetDetailContainer")
export class BetDetailContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: BetDetailTable = null;

    @render(BetDetailStore, (store) => store.betLog, { fireImmediately: false })
    showBetDetailPopup(betLog: IBetLog) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetDetailTable);
        }

        this.table.showBetDetail(betLog);
    }
}
