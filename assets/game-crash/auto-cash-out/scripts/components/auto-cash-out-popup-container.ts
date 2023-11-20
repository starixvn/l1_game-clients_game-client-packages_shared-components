import { _decorator, Node } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";
import AutoCashOutPopupHandler from "../handlers/auto-cash-out-popup-handler";
import AutoCashOutPopupStore from "../stores/auto-cash-out-popup-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashoutPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(AutoCashOutPopupStore, (store) => store.enable)
    openPopup(enable: boolean) {
        this.nodeOverlay.active = enable;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(AutoCashOutPopupHandler, (handle, enable: boolean) => handle.togglePopup(enable))
    closePopup() {
        return false;
    }
}
