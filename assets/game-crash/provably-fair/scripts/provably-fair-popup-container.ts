import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { MultipleNodeContainer } from "../../../shared/common-components/node-container/multiple-node-container";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

enum Popup {
    ClientSeedSetting = "ClientSeedSetting",
    PFVerification = "PFVerification",
}

@ccclass
export class ProvablyFairPopupContainer extends MultipleNodeContainer {
    @render(gc.GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.openClientSeedPopup)
    private renderOpenClientSeedPopup(openClientSeedPopup: boolean) {
        this.showNode(Popup.ClientSeedSetting);
    }

    @render(gc.GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.verification)
    private renderVerificationPopup() {
        this.showNode(Popup.PFVerification);
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openCS: boolean) => handle.handleClientSeedPopup(openCS))
    private closeClientSeedSetting() {
        return false;
    }

    onClickOverlay() {
        super.onClickOverlay();
        this.closeClientSeedSetting();
    }
}
