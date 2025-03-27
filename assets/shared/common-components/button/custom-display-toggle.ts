import { _decorator, Node, Toggle } from "cc";

const { ccclass, property } = _decorator;

@ccclass("CustomDisplayToggle")
export class CustomDisplayToggle extends Toggle {
    @property(Node)
    disabledDisplayNode: Node = null;

    @property(Node)
    unCheckImage: Node = null;

    @property(Node)
    checkMarkNode: Node = null;

    _internalToggle() {
        super._internalToggle();

        this.unCheckImage && (this.unCheckImage.active = !this.isChecked);
        this.checkMarkNode && (this.checkMarkNode.active = this.isChecked);
    }

    _updateState() {
        super._updateState();
        if (this.disabledDisplayNode) {
            this.disabledDisplayNode.active = !this.interactable;
        }
    }
}
