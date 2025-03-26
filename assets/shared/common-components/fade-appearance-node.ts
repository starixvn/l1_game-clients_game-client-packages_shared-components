import { _decorator, tween, Tween, UIOpacity } from "cc";
import { ObserverComponent } from "./observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

@ccclass
export class FadeAppearanceNode extends ObserverComponent {
    @property
    appearanceDuration = 0.2;

    onHidden = () => {};
    isShowing = false;

    private appearanceTween: Tween<UIOpacity>;
    private opacityNode;

    showViewQuickly(show: boolean) {
        this.isShowing = show;
        this.opacityNode = this.node.getComponent(UIOpacity);
        this.opacityNode.opacity = show ? 255 : 0;
    }

    showView(show: boolean, force = false) {
        return new Promise<void>((resolve) => {
            const duration = this.appearanceDuration;
            if (show) {
                if (!this.isShowing || force) {
                    this.isShowing = true;
                    this.appearanceTween && this.appearanceTween.stop();
                    this.appearanceTween = tween(this.opacityNode)
                        .to(duration, { opacity: 255 })
                        .call(() => resolve())
                        .start();
                } else {
                    resolve();
                }
            } else {
                if (this.isShowing || force) {
                    this.isShowing = false;
                    this.appearanceTween && this.appearanceTween.stop();
                    this.appearanceTween = tween(this.opacityNode)
                        .to(duration, { opacity: 0 })
                        .call(() => this.onHidden())
                        .call(() => resolve())
                        .start();
                } else {
                    resolve();
                }
            }
        });
    }
}
