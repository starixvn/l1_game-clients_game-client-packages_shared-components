import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;
const { fadeIn } = AnimationUtils;

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

    hideTooltip() {
        this.nodeTooltip.active = this.nodeOverlay.active = false;
    }

    showTooltip() {
        this.nodeTooltip.active = this.nodeOverlay.active = true;
    }

    clickInfoIcon() {
        this.nodeTooltip.active = !this.nodeTooltip.active;
        this.nodeOverlay.active = !this.nodeOverlay.active;
        this.setContentTooltip(this.keyText);
    }

    setContentTooltip(key: string) {
        this.lblContent.string = `${gc.Translator.commonTranslate(key)}`;
        fadeIn(this.lblContent.node, 0.3);
    }
}
