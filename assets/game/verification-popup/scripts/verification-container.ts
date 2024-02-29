import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import gc from "@sg/game-client-base";
import WebViewVerification from "./web-view-verification";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass()
export default class VerificationContainer extends NodeContainer {
    @render(gc.PFVerification.WebViewPFVerificationStore, (store) => store.openVerificationPopup)
    openVerificationPopup(isOpen: boolean) {
        console.log("openVerificationPopup", isOpen);
        const guide = this.createNode();
        guide.getComponent(WebViewVerification)?.initUrl("");
    }
}
