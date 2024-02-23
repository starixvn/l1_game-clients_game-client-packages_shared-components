import gc from "@sg/game-client-base";
import { _decorator, Button, Component, Label, Node } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;
const { fadeIn } = AnimationUtils;

@ccclass
export class IconInfoPopup extends Component {
    @property(Node)
    nodeTooltip: Node = null;

    @property(Button)
    btnBgOverlay: Button = null;

    @property(Label)
    lblContent: Label = null;

    @property
    keyText: string = "";

    onLoad() {
        this.btnBgOverlay.node.on("click", this.hideTooltip, this);
    }

    hideTooltip() {
        this.nodeTooltip.active = this.btnBgOverlay.node.active = false;
    }

    showTooltip() {
        this.nodeTooltip.active = this.btnBgOverlay.node.active = true;
    }

    clickInfoIcon() {
        this.nodeTooltip.active = !this.nodeTooltip.active;
        this.btnBgOverlay.node.active = !this.btnBgOverlay.node.active;
        this.setContentTooltip(this.keyText);
    }

    setContentTooltip(key: string) {
        this.lblContent.string = `${gc.Translator.commonTranslate(key)}`;
        fadeIn(this.lblContent.node, 0.3);
    }
}
