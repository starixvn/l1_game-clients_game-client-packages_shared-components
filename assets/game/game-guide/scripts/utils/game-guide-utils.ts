import { error, find, math, tween, TweenEasing, v3, view } from "cc";
import WebViewGuide from "../web-view-guide";

export class GameGuideUtils {
    private static webViewGuideInstance: WebViewGuide | null = null;

    private static readonly ANIMATION_CONFIG = {
        HIDE: {
            duration: 0.1,
            easing: "sineOut" as TweenEasing,
            position: () => v3(-view.getVisibleSize().width, 0, 0),
        },
        SHOW: {
            duration: 0.2,
            easing: "sineIn" as TweenEasing,
            position: () => v3(0, 0, 0),
        },
    } as const;

    private static getWebViewGuide(): WebViewGuide | null {
        if (!GameGuideUtils.webViewGuideInstance) {
            const canvas = find("Canvas");
            if (!canvas) {
                return null;
            }

            GameGuideUtils.webViewGuideInstance = canvas.getComponentInChildren(WebViewGuide) || null;
        }

        return GameGuideUtils.webViewGuideInstance;
    }

    static hideWebViewGuide(): Promise<void> {
        try {
            return GameGuideUtils.animateWebViewGuide(this.ANIMATION_CONFIG.HIDE);
        } catch (errorMessage) {
            error("[GameGuideUtils] Failed to hide web view guide:", errorMessage);
        }
    }

    static showWebViewGuide(): Promise<void> {
        try {
            return GameGuideUtils.animateWebViewGuide(this.ANIMATION_CONFIG.SHOW);
        } catch (errorMessage) {
            error("[GameGuideUtils] Failed to show web view guide:", errorMessage);
        }
    }

    private static animateWebViewGuide(config: { duration: number; easing: TweenEasing; position: () => math.Vec3 }): Promise<void> {
        const webViewGuide = GameGuideUtils.getWebViewGuide();
        if (!webViewGuide?.node) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            tween(webViewGuide.node)
                .to(config.duration, { position: config.position() }, { easing: config.easing })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
}
