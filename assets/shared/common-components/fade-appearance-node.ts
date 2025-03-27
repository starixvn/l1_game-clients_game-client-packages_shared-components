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

    showViewQuickly(show: boolean) {
        this.isShowing = show;
        this.node.getComponent(UIOpacity).opacity = show ? 255 : 0;
    }

    showView(show: boolean, force = false) {
        return new Promise<void>((resolve) => {
            const duration = this.appearanceDuration;
            const opacityNode = this.node.getComponent(UIOpacity);
            if (show) {
                if (!this.isShowing || force) {
                    this.isShowing = true;
                    this.appearanceTween && this.appearanceTween.stop();
                    this.appearanceTween = tween(opacityNode)
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
                    this.appearanceTween = tween(opacityNode)
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
