import { _decorator, Component, Node } from "cc";
import { AnimationUtils } from "../../utils/utils";

const { bounceIn, bounceOut, fadeIn, fadeOut } = AnimationUtils;
const { ccclass, property } = _decorator;

@ccclass("Dialog")
export class Dialog extends Component {
    @property(Node)
    nodeFadeBackground: Node = null;

    @property(Node)
    nodeBody: Node = null;

    protected readonly appearDuration = 0.4;

    onEnable() {
        this.show();
    }

    show() {
        if (this.nodeFadeBackground) {
            this.nodeFadeBackground.active = true;
            fadeIn(this.nodeFadeBackground, 0.1);
        }
        if (this.nodeBody) {
            fadeIn(this.nodeBody, 0.3);
            bounceIn(this.nodeBody, this.nodeBody.scale, this.appearDuration);
        }
    }

    hide() {
        if (this.nodeFadeBackground) {
            fadeOut(this.nodeFadeBackground, this.appearDuration).then(() => (this.nodeFadeBackground.active = false));
        }
        if (this.nodeBody) {
            fadeOut(this.nodeBody, this.appearDuration);
            bounceOut(this.nodeBody, this.appearDuration).then(() => {
                this.node?.destroy();
            });
        }
    }
}
