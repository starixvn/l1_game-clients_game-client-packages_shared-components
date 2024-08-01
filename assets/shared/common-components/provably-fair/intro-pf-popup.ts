import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import WebViewGuide from "../../../game/game-guide/scripts/web-view-guide";
const { ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass
export class IntroPFPopup extends WebViewGuide {
    @handle(gc.GuidePF.GuidePFHandlers, (handle) => handle.resetUrl())
    onResetUrl() {}

    @render(gc.GuidePF.GuidePFStore, (store) => store.url)
    setURLGuide(url: string) {
        this.url = url;
    }
    override loadGameGuide(url: string) {}
}
