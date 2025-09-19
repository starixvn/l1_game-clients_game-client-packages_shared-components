import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import WebViewVerification from "db://shared-components/game/verification-popup/scripts/web-view-verification";

const { UrlUtils, PFVerification } = gc;
const { handle } = Observer;
const { ccclass } = _decorator;

@ccclass
export default class OriginalGamesWebViewVerification extends WebViewVerification {
    @handle(PFVerification.WebViewPFVerificationHandlers.GetVerificationURL)
    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "original";
        return { theme, specialDirection, scrollToId };
    }
}
