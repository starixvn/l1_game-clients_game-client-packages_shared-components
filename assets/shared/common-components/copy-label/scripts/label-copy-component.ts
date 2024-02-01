import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class LabelCopyComponent extends Component {
    @property(Label)
    lblText: Label = null;

    clickCopyButton() {
        gc.GameUtils.copyToClipboard(this.lblText.string);
    }
}
