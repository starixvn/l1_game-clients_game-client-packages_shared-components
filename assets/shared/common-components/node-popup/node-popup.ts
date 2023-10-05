import { _decorator, Node } from "cc";
import { NodeContainer } from "../node-container/node-container";
const { ccclass, property } = _decorator;

@ccclass
export class NodePopup extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    createNode() {
        if (this.node.children.length > 1) {
            return;
        }
        return super.createNode();
    }

    protected renderOpenPopup(isOpenPopup: boolean) {
        this.nodeOverlay.active = isOpenPopup;
        this.createNode();
    }
}
