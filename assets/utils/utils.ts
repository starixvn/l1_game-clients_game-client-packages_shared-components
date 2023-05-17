import { math, Node, tween, UIOpacity } from "cc";
export namespace AnimationUtils {
    export const fadeIn = (node: Node, duration: number, opacity = 255) => {
        const uiOpacity = node.getComponent(UIOpacity);
        fadeTo(uiOpacity, duration, opacity);
    };

    export const fadeOut = (node: Node, duration: number, opacity = 0) => {
        const uiOpacity = node.getComponent(UIOpacity);
        return fadeTo(uiOpacity, duration, opacity);
    };

    export const fadeTo = (uiOpacity: UIOpacity, duration: number, opacity: number) => {
        if (uiOpacity) {
            tween(uiOpacity).to(duration, { opacity: opacity }).start();
        }

        return new Promise<void>((resolve) => {
            if (uiOpacity) {
                tween(uiOpacity)
                    .to(duration, { opacity: opacity })
                    .call(() => resolve())
                    .start();
            } else {
                resolve();
            }
        });
    };

    export const bounceIn = (node: Node, scale: math.Vec3, duration: number) => {
        const originalScale = node.scale.clone();
        node.scale = math.Vec3.ZERO;
        return bounceTo(node, originalScale, duration);
    };

    export const bounceTo = (node: Node, scaleTo: math.Vec3, duration: number) => {
        return new Promise<void>((resolve) => {
            tween(node)
                .to(duration, { scale: scaleTo }, { easing: "backOut" })
                .call(() => resolve())
                .start();
        });
    };

    export const bounceOut = (node: Node, duration: number, scaleTo = math.Vec3.ZERO) => {
        return new Promise<void>((resolve) => {
            tween(node)
                .to(duration, { scale: scaleTo }, { easing: "backIn" })
                .call(() => resolve())
                .start();
        });
    };
}
