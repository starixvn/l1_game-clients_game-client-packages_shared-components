import gc from "@sg/game-client-base";
import { _decorator, Node, Tween, v3 } from "cc";
import Observer from "observer";
import { AnimationUtils } from "../../utils/utils";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { bounceIn, bounceOut, fadeIn, fadeOut, FadeTag } = AnimationUtils;
const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass("Dialog")
export class Dialog extends ObserverComponent {
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
            Tween.stopAllByTag(FadeTag, this.nodeFadeBackground);
            promises.push(fadeIn(this.nodeFadeBackground, 0.1));
        }

        if (this.nodeBody) {
            Tween.stopAllByTag(FadeTag, this.nodeBody);
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
            this.nodeFadeBackground.active = false;
        }
        if (this.nodeBody) {
            this.node?.destroy();
        }
    }

    hide() {
        this.playSoundClick();
        if (this.nodeFadeBackground) {
            Tween.stopAllByTag(FadeTag, this.nodeFadeBackground);
            fadeOut(this.nodeFadeBackground, this.appearDuration).then(
                () => this.nodeFadeBackground && (this.nodeFadeBackground.active = false)
            );
        }
        if (this.nodeBody) {
            Tween.stopAllByTag(FadeTag, this.nodeBody);
            fadeOut(this.nodeBody, this.appearDuration);
            bounceOut(this.nodeBody, this.appearDuration).then(() => {
                this.node?.destroy();
            });
        }
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    playSoundClick() {}
}
