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
        this.btnBgOverlay.node.on("click", this.hideTooltipComp, this);
    }

    hideTooltipComp() {
        this.nodeTooltip.active = this.btnBgOverlay.node.active = false;
    }

    showTooltipComp() {
        this.nodeTooltip.active = this.btnBgOverlay.node.active = true;
    }

    setDisplayTooltip(show: boolean) {
        this.nodeTooltip.active = show;
    }

    clickInfoIcon() {
        this.nodeTooltip.active = !this.nodeTooltip.active;
        const isActiveBgOverlay = this.btnBgOverlay.node.active;
        if (!isActiveBgOverlay) {
            this.btnBgOverlay.node.active = !this.btnBgOverlay.node.active;
        }
        this.setContentTooltip(this.keyText);
    }

    setContentTooltip(key: string) {
        this.lblContent.string = `${gc.Translator.commonTranslate(key)}`;
        fadeIn(this.lblContent.node, 0.3);
    }
}
