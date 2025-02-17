import { find, tween, v3, view } from "cc";
import WebViewGuide from "../../../game-guide/scripts/web-view-guide";

export namespace BoostedOddsUtils {
    export const moveWebViewGuide = (isLeftCorner: boolean, duration = 0.1): Promise<void> => {
        return new Promise((resolve) => {
            const webViewGuide = find("Canvas").getComponentInChildren(WebViewGuide);
            if (webViewGuide) {
                const positionX = isLeftCorner ? -view.getVisibleSize()?.width || 0 : 0;
                const tweenEasing = isLeftCorner ? "sineIn" : "sineOut";
                webViewGuide?.node &&
                    tween(webViewGuide.node)
                        .to(duration, { position: v3(positionX, 0, 0) }, { easing: tweenEasing })
                        .call(() => {
                            resolve();
                        })
                        .start();
            } else {
                resolve();
            }
        });
    };
}
