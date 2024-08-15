import { _decorator, Component, Node, v3 } from "cc";
import { AnimationUtils } from "../../utils/utils";

const { bounceIn, bounceOut, fadeIn, fadeOut, stopFade } = AnimationUtils;
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
            stopFade(this.nodeFadeBackground);
            promises.push(fadeIn(this.nodeFadeBackground, 0.1));
        }

        if (this.nodeBody) {
            stopFade(this.nodeBody);
            promises.push([fadeIn(this.nodeBody, 0.3), bounceIn(this.nodeBody, this.nodeBody.scale, this.appearDuration)]);
        }

        await Promise.all(promises);
        this.callBackFn?.();
    }

    showQuickly() {
        if (this.nodeFadeBackground) {
            this.nodeFadeBackground.active = true;
            AnimationUtils.setOpacityNode(this.nodeFadeBackground, 255);
        }

        if (this.nodeBody) {
            AnimationUtils.setOpacityNode(this.nodeBody, 255);
            this.nodeBody.scale = v3(1, 1, 1);
        }

        this.callBackFn?.();
    }

    hideQuickly() {
        if (this.nodeFadeBackground) {
            stopFade(this.nodeFadeBackground);
            this.nodeFadeBackground.active = false;
        }
        if (this.nodeBody) {
            stopFade(this.nodeBody);
            this.node?.destroy();
        }
    }

    hide() {
        if (this.nodeFadeBackground) {
            stopFade(this.nodeFadeBackground);
            fadeOut(this.nodeFadeBackground, this.appearDuration).then(
                () => this.nodeFadeBackground && (this.nodeFadeBackground.active = false)
            );
        }
        if (this.nodeBody) {
            stopFade(this.nodeBody);
            fadeOut(this.nodeBody, this.appearDuration);
            bounceOut(this.nodeBody, this.appearDuration).then(() => {
                this.node?.destroy();
            });
        }
    }
}
