import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import WebViewGuide from "db://shared-components/game/game-guide/scripts/web-view-guide";

const { GameGuide } = gc;
const { handle, render } = Observer;
const { ccclass } = _decorator;

@ccclass
export default class OriginalGamesWebViewGuide extends WebViewGuide {
    @handle(GameGuide.GameGuideHandlers.GetGuideURL)
    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "original";
        return { theme, specialDirection, scrollToId };
    }
}
