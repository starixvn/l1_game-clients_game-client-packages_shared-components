import gc from "@sg/game-client-base";
import { _decorator, Button, Component, Label, Node } from "cc";
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

    private cpnCopyButton: Md5CopyButton = null;

    onLoad() {
        this.cpnCopyButton = this.btnCopy.getComponent(Md5CopyButton);
    }

    setString(value: string) {
        this.lblText.string = value;
    }

    setActive(active: boolean) {
        this.btnCopy.interactable = active;

        if (this.nodeDisable) {
            this.nodeDisable.active = !active;
        }
    }

    clickCopyButton() {
        this.cpnCopyButton && (this.cpnCopyButton.isCopying = true);
        gc.GameUtils.copyToClipboard(this.lblText.string);
    }
}
