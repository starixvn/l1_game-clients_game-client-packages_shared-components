import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { BetInputHandler } from "./handlers/bet-input-handlers";
import { BetInputStore } from "./stores/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    createNode() {
        if (this.node.children.length > 1) {
            return;
        }
        return super.createNode();
    }

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private renderOpenBetAmountPopup(isOpenBetAmountPopup: boolean) {
        this.nodeOverlay.active = isOpenBetAmountPopup;
        this.createNode();
    }

    @handle(BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onClickCloseBetAmountPopup(event) {}
}
