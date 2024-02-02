import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class LabelCopyComponent extends Component {
    @property(Label)
    lblText: Label = null;

    setString(value: string) {
        this.lblText.string = value;
    }

    clickCopyButton() {
        gc.GameUtils.copyToClipboard(this.lblText.string);
    }
}
