import { find, tween, TweenEasing, v3, view } from "cc";
import WebViewGuide from "../web-view-guide";

export class GameGuideUtils {
    private static webViewGuideInstance: WebViewGuide | null = null;

    private static readonly ANIMATION_CONFIG = {
        HIDE: {
            duration: 0.1,
            easing: "sineOut" as TweenEasing,
            position: () => -view.getVisibleSize().width,
        },
        SHOW: {
            duration: 0.2,
            easing: "sineIn" as TweenEasing,
            position: () => 0,
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
        return GameGuideUtils.animateWebViewGuide(this.ANIMATION_CONFIG.HIDE);
    }

    static showWebViewGuide(): Promise<void> {
        return GameGuideUtils.animateWebViewGuide(this.ANIMATION_CONFIG.SHOW);
    }

    private static animateWebViewGuide(config: { duration: number; easing: TweenEasing; position: () => number }): Promise<void> {
        return new Promise((resolve) => {
            const webViewGuide = GameGuideUtils.getWebViewGuide();
            if (!webViewGuide?.node) {
                resolve();
                return;
            }

            tween(webViewGuide.node)
                .to(
                    config.duration,
                    {
                        position: v3(config.position(), 0, 0),
                    },
                    {
                        easing: config.easing,
                    }
                )
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
}
