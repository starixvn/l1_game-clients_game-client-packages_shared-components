import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import LoadWebView from "../../../shared/common-components/web-view/load-web-view";
import WebViewVerification from "db://shared-components/game/verification-popup/scripts/web-view-verification";

const { UrlUtils, PFVerification } = gc;
const { handle, render } = Observer;
const { ccclass, property } = _decorator;

@ccclass
export default class OriginalGamesWebViewVerification extends WebViewVerification {
    @handle(PFVerification.WebViewPFVerificationHandlers.GetVerificationURL)
    initUrl(specialDirection = "", scrollToId = "") {
        const theme = "original";
        return { theme, specialDirection, scrollToId };
    }
}
