import gc from "@sg/game-client-base";
import { _decorator, Button, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class LabelCopyComponent extends Component {
    @property(Label)
    lblText: Label = null;

    @property(Button)
    btnCopy: Button = null;

    @property(Node)
    nodeDisable: Node = null;

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
        gc.GameUtils.copyToClipboard(this.lblText.string);
    }
}
