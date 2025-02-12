import { find, tween, v3, view } from "cc";
import { GameGuideContainer } from "../../../game-guide/scripts/game-guide-container";

export namespace BoostedOddsUtils {
    export const moveWebViewGuide = (isShow: boolean, duration = 0.3) => {
        const webViewGuide = find("Canvas").getComponentInChildren(GameGuideContainer);
        if (webViewGuide) {
            const positionX = isShow ? 0 : -view.getVisibleSize()?.width || 0;
            const tweenEasing = isShow ? "sineIn" : "sineOut";
            webViewGuide?.node &&
                tween(webViewGuide.node)
                    .to(duration, { position: v3(positionX, 0, 0) }, { easing: tweenEasing })
                    .start();
        }
    };
}
