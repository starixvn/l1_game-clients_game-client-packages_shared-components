import { _decorator } from "cc";
import LoadWebView from "../../../shared/common-components/web-view/load-web-view";
const { ccclass, property } = _decorator;

@ccclass
export class BetTicketDetails extends LoadWebView {
    openBetDetails(url: string) {
        this.url = url;
        this.loadWebView();
    }
}
