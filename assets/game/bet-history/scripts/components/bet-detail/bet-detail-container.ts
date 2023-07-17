import { Node, _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../../../shared/common-components/node-container/node-container";
import { BetDetailTable } from "./bet-detail-table";
import { IBetDetailModel, BetDetailStore } from "./stores/bet-detail-store";

const { ccclass } = _decorator;
const { render} = Observer;

@ccclass("BetDetailContainer")
export class BetDetailContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: BetDetailTable = null;

    @render(BetDetailStore, (store) => store.model, { fireImmediately: false })
    showBetDetailPopup(model: IBetDetailModel) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetDetailTable);
        }

        this.table.showBetDetail(model);
    }
}
