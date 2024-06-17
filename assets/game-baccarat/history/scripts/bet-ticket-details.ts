import { _decorator } from "cc";
import Observer from "observer";
import WebViewGuide from "../../../game/game-guide/scripts/web-view-guide";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetTicketDetails extends WebViewGuide {
    openBetDetails(url: string) {
        this.loadContent(url);
    }
}
