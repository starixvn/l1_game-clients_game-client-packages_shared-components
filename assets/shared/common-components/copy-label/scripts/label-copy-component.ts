import gc from "@sg/game-client-base";
import { _decorator, Button, Component, Label, Node, UIOpacity } from "cc";
import { Md5CopyButton } from "../../../../game/md5/scripts/md5-copy-button";
const { ccclass, property } = _decorator;

@ccclass
export class LabelCopyComponent extends Component {
    @property(Label)
    lblText: Label = null;

    @property(Button)
    btnCopy: Button = null;

    @property(Node)
    nodeDisable: Node = null;

    @property(Node)
    nodeOverlayText = null;

    @property(Node)
    nodeDisableCopy = null;

    private cpnCopyButton: Md5CopyButton = null;

    onLoad() {
        this.cpnCopyButton = this.btnCopy.getComponent(Md5CopyButton);
    }

    setString(value: string) {
        this.lblText.string = value;
    }

    setActive(active: boolean) {
        this.btnCopy.interactable = active;
        this.lblText.node.parent.getComponent(UIOpacity).opacity = active ? 255 : 153;

        if (this.nodeDisable) {
            this.nodeDisable.active = !active;
        }
        if (this.nodeOverlayText) {
            this.nodeOverlayText.active = active;
        }
        this.nodeDisableCopy && (this.nodeDisableCopy.active = !active);
    }

    clickCopyButton() {
        this.cpnCopyButton && (this.cpnCopyButton.isCopying = true);
        gc.GameUtils.copyToClipboard(this.lblText.string);
    }
}
