import gc from "@sg/game-client-base";
import { Animation, Component, Label, math, Node, sp, sys, Tween, tween, TweenEasing, UIOpacity, UITransform, v3, Vec3 } from "cc";

export namespace AnimationUtils {
    export const FadeTag = 1001;
    export const ScaleTag = 1002;
    export const getUiOpacity = (node: Node) => {
        let uiOpacity = node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = node.addComponent(UIOpacity);
        }
        return uiOpacity;
    };

    export const setOpacityNode = (node: Node, opacity: number) => {
        getUiOpacity(node).opacity = opacity;
    };

    export const stopFade = (node: Node) => {
        const uiOpacity = getUiOpacity(node);
        if (uiOpacity) {
            Tween.stopAllByTag(FadeTag, uiOpacity);
        }
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

        node.active = true;
        return new Promise<void>((resolve) => {
            if (uiOpacity) {
                tween(uiOpacity)
                    .to(duration, { opacity: opacity })
                    .call(() => resolve())
                    .union()
                    .tag(FadeTag)
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

    export const scaleHop = (node: Node, scale: math.Vec3, duration = 0.3) => {
        const originalScale = v3(node.scale);
        return scaleTransition(node, [
            { scale, duration: 0.1, easing: "sineIn" },
            { scale: originalScale, duration, easing: "backOut" },
        ]);
    };

    export const scaleTransition = (node: Node, config: { scale: math.Vec3; duration: number; easing: TweenEasing }[]) => {
        return new Promise<void>((resolve) => {
            Tween.stopAllByTag(ScaleTag, node);
            const tweens = config.map((item) => tween(node).to(item.duration, { scale: item.scale }, { easing: item.easing }));
            tween(node)
                .sequence(...tweens)
                .call(() => resolve())
                .union()
                .tag(ScaleTag)
                .start();
        });
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

    export const playSpineAtProgress = (spine: sp.Skeleton, animationName: string, progress: number) => {
        const animation = spine.findAnimation(animationName);
        if (animation) {
            spine.setAnimation(0, animationName, false);
            const trackEntry = spine.getCurrent(0);
            trackEntry.trackTime = trackEntry.animationEnd * progress;
        }
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

    export const playSpine = (spine: sp.Skeleton, animationName: string, isLoop = false, duration?: number) => {
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

            spine.setAnimation(0, animationName, isLoop);

            tween(spine)
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    };

    export const playSkinSpine = (
        spine: sp.Skeleton,
        animationName: string,
        skin: string,
        track = 0,
        isLoop = false,
        duration?: number
    ) => {
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

            spine.setAnimation(track, animationName, isLoop);
            if (skin) {
                spine.setSkin(skin);
            }

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

    export const isAnimationPlaying = (spine: sp.Skeleton, animName: string): boolean => {
        const trackCount = spine?.getState()?.tracks?.length;

        for (let trackIndex = 0; trackIndex < trackCount; trackIndex++) {
            const trackEntry = spine.getCurrent(trackIndex);
            if (!trackEntry) continue;

            if (trackEntry.animation.name === animName) {
                return trackEntry.trackTime < trackEntry.animationEnd;
            }
        }

        return false;
    };

    export const pauseSpineAnimation = (spineAnimation: sp.Skeleton, startProgress: number, animationName: string) => {
        spineAnimation.node.active = true;
        spineAnimation.timeScale = 0;
        spineAnimation.setAnimation(0, animationName, false);
        const trackEntry = spineAnimation.getCurrent(0);
        trackEntry.animationStart = trackEntry.animationEnd * startProgress;
    };

    export const updateSpineDuration = (spine: sp.Skeleton, animationName: string, duration: number) => {
        const original = spine.findAnimation(`${animationName}`).duration;
        spine.timeScale = original / duration;
    };

    export const floatToNumber = (opt: {
        label: Label;
        amount: number;
        duration: number;
        start?: number;
        noZeroSuffix?: boolean;
        prefixStr?: string;
    }) => {
        const { label, amount: end, start, duration } = opt;
        const noZeroSuffix = opt.noZeroSuffix ?? true;
        const prefixStr = opt.prefixStr ?? "";
        const startStr = label.string.replace(prefixStr, "");
        const startValue = start || parseFloat(startStr.replace(/,/g, "")) || 0;
        const range = Math.abs(end - startValue);
        if (!range) {
            return;
        }

        let stepTime, repeatCount, stepValue;
        if (duration !== undefined) {
            stepTime = Math.max(duration / range, 0.05);
            repeatCount = Math.floor(duration / stepTime);
            stepValue = +(range / repeatCount).toFixed(2);
        } else {
            stepValue = 0.01;
            stepTime = 0.1;
            repeatCount = Math.floor(range / stepValue);
        }

        let value = startValue;
        //label.node.stopAllActions();
        tween(label.node)
            .repeat(
                repeatCount,
                tween(label.node)
                    .call(() => {
                        label.string = prefixStr + gc.FormatUtils.numberWithCommas(value, 2, noZeroSuffix);
                        value += stepValue;
                    })
                    .delay(stepTime)
            )
            .call(() => {
                label.string = prefixStr + gc.FormatUtils.numberWithCommas(end, 2, noZeroSuffix);
            })
            .start();
    };

    export const floatToNumber2 = (opt: {
        label: Label;
        amount: number;
        start?: number;
        prefixStr?: string;
        formatNumber?: (value) => string;
        stepValue?: number;
        stepTime?: number;
    }) => {
        return new Promise<void>((resolve) => {
            const { label, amount: end, start } = opt;
            const prefixStr = opt.prefixStr ?? "";
            const defaultFormater = (v) => gc.FormatUtils.numberWithCommas(v, 2, false);
            const formatNumber = opt.formatNumber ?? defaultFormater;
            const stepValue = opt.stepValue ?? 0.01;
            const stepTime = opt.stepTime ?? 0.02;
            const startStr = label.string.replace(prefixStr, "");
            const startValue = start || parseFloat(startStr.replace(/,/g, "")) || 0;
            const range = Math.abs(end - startValue);
            if (!range) {
                resolve();
                return;
            }

            const repeatCount = Math.floor(range / stepValue);

            let value = startValue;
            //label.node.stopAllActions();
            const formatText = (value) => prefixStr + formatNumber(value);
            tween(label.node)
                .repeat(
                    repeatCount,
                    tween(label.node)
                        .call(() => {
                            label.string = formatText(value);
                            value += stepValue;
                        })
                        .delay(stepTime)
                )
                .call(() => {
                    label.string = formatText(end);
                    resolve();
                })
                .start();
        });
    };
}
export const isValidNode = (comp: Component) => {
    return comp.node && comp.node.isValid;
};

export const isIOS = () => {
    return sys.os === sys.OS.IOS;
};

export const truncatedNickname = (nickname: string, maxLength = 8) => {
    let truncatedNickname = "";
    if (nickname) {
        if (nickname.length > maxLength) {
            truncatedNickname = `${nickname.substring(0, maxLength - 1)}...`;
        } else {
            truncatedNickname = nickname;
        }
    }

    return truncatedNickname;
};
