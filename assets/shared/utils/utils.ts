import { Animation, Node, UIOpacity, UITransform, Vec3, math, sp, tween } from "cc";

export namespace AnimationUtils {
    export const fadeIn = (node: Node, duration: number, opacity = 255) => {
        const uiOpacity = node.getComponent(UIOpacity);
        return fadeTo(uiOpacity, duration, opacity);
    };

    export const fadeOut = (node: Node, duration: number, opacity = 1) => {
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

    export const playAnimation = (animation: Animation, animationName: string, duration?: number) => {
        return new Promise<void>((resolve, reject) => {
            const onFinished = () => {
                animation.off(Animation.EventType.FINISHED, onFinished);
                resolve();
            };
            if (duration) {
                const clip = animation.clips.find((clip) => clip.name === animationName);
                clip.speed = clip.duration / duration;
            }
            animation.on(Animation.EventType.FINISHED, onFinished);
            animation.play(animationName);
        });
    };

    export const playSpine = (spine: sp.Skeleton, animationName: string, duration?: number) => {
        return new Promise<void>((resolve, reject) => {
            const animationDuration = spine.findAnimation(animationName).duration;
            if (duration) {
                spine.timeScale = animationDuration / duration;
            } else {
                duration = animationDuration;
            }
            spine.setAnimation(0, animationName, false);
            tween(spine)
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    };

    export const getPositionAtDestNode = (node: Node, destNode: Node) => {
        const parent = node.parent.getComponent(UITransform);
        const destNodeTranform = destNode.getComponent(UITransform);
        return parent.convertToNodeSpaceAR(destNodeTranform.convertToWorldSpaceAR(Vec3.ZERO));
    };

    export const movingNode = (node: Node, duration: number, destNode: Node | Vec3) => {
        const position = destNode instanceof Node ? getPositionAtDestNode(node, destNode) : destNode;
        tween(node)
            .to(duration, {
                position,
            })
            .start();
    };
}
