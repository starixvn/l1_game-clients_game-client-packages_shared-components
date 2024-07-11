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

    @property
    autoShowWhenEnable = true;

    protected readonly appearDuration = 0.4;

    callBackFn = () => {};

    onEnable() {
        this.autoShowWhenEnable && this.show();
    }

    async show() {
        const promises = [];
        if (this.nodeFadeBackground) {
            this.nodeFadeBackground.active = true;
            promises.push(fadeIn(this.nodeFadeBackground, 0.1));
        }

        if (this.nodeBody) {
            promises.push(Promise.all([fadeIn(this.nodeBody, 0.3), bounceIn(this.nodeBody, this.nodeBody.scale, this.appearDuration)]));
        }

        await Promise.all(promises);
        this.callBackFn?.();
    }

    hide() {
        if (this.nodeFadeBackground) {
            fadeOut(this.nodeFadeBackground, this.appearDuration).then(
                () => this.nodeFadeBackground && (this.nodeFadeBackground.active = false)
            );
        }
        if (this.nodeBody) {
            fadeOut(this.nodeBody, this.appearDuration);
            bounceOut(this.nodeBody, this.appearDuration).then(() => {
                this.node?.destroy();
            });
        }
    }
}
