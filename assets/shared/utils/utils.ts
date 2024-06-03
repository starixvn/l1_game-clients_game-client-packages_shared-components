import { Animation, Component, math, Node, sp, tween, UIOpacity, UITransform, Vec3 } from "cc";

export namespace AnimationUtils {
    export const getUiOpacity = (node: Node) => {
        let uiOpacity = node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = node.addComponent(UIOpacity);
        }
        return uiOpacity;
    };
    export const fadeIn = (node: Node, duration: number, opacity = 255) => {
        return fadeTo(node, duration, opacity);
    };

    export const fadeOut = (node: Node, duration: number, opacity = 1) => {
        return fadeTo(node, duration, opacity);
    };

    export const fadeOutAndDeactivate = async (node: Node, duration: number, opacity = 1) => {
        await fadeTo(node, duration, opacity);
        node.active = false;
    };

    export const fadeInAndActivate = async (node: Node, duration: number, opacity = 255) => {
        await fadeIn(node, duration, opacity);
        node.active = true;
    };

    export const fadeTo = (node: Node, duration: number, opacity: number) => {
        const uiOpacity = getUiOpacity(node);

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
            if (duration > 0) {
                const state = animation.getState(animationName);
                state.speed = state.clip.duration / duration;
            }
            animation.on(Animation.EventType.FINISHED, onFinished);
            animation.play(animationName);
        });
    };

    export const playSpine = (spine: sp.Skeleton, animationName: string, isLoop = false, duration?: number, skin?: string) => {
        return new Promise<void>((resolve, reject) => {
            const animation = spine.findAnimation(animationName);
            if (!animation) {
                resolve();
                return;
            }
            const animationDuration = animation.duration;
            if (duration) {
                spine.timeScale = animationDuration / duration;
            } else {
                duration = animationDuration;
            }

            if (skin) {
                spine.setSkin(skin);
            }

            spine.setAnimation(0, animationName, isLoop);
            tween(spine)
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    };

    export const getPositionAtDestNode = (node: Node, destNode: Node) => {
        const parent = node.parent.getComponent(UITransform);
        const destNodeTransform = destNode.getComponent(UITransform);
        return parent.convertToNodeSpaceAR(destNodeTransform.convertToWorldSpaceAR(Vec3.ZERO));
    };

    export const movingNode = (node: Node, duration: number, destNode: Node | Vec3) => {
        const position = destNode instanceof Node ? getPositionAtDestNode(node, destNode) : destNode;
        tween(node)
            .to(duration, {
                position,
            })
            .start();
    };

    export const delayTime = (time: number) => {
        return new Promise<void>((resolve) => {
            tween({})
                .delay(time)
                .call(() => resolve())
                .start();
        });
    };
}
export const isValidNode = (comp: Component) => {
    return comp.node && comp.node.isValid;
};
