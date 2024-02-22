import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class IconInfoPopup extends Component {
    @property(Node)
    nodeTooltip: Node = null;

    @property(Node)
    nodeOverlay: Node = null;

    @property(Label)
    lblContent: Label = null;

    @property
    keyText: string = "";

    private readonly PADDIND = 10;

    hideTooltip() {
        this.nodeTooltip.active = this.nodeOverlay.active = false;
    }

    showTooltip() {
        this.nodeTooltip.active = this.nodeOverlay.active = true;
    }

    clickInfoIcon() {
        this.setContentTooltip(this.keyText);
        this.nodeTooltip.active = !this.nodeTooltip.active;
        this.nodeOverlay.active = !this.nodeOverlay.active;
    }

    setContentTooltip(key: string) {
        this.lblContent.string = `${gc.Translator.commonTranslate(key)}`;
    }
}
