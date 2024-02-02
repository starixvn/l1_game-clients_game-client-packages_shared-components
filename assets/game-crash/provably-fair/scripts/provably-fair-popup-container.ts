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
        if (openClientSeedPopup) {
            this.showNode(Popup.ClientSeedSetting);
        } else {
            this.onClose();
        }
    }

    @render(gc.GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.openVerification, { fireImmediately: false })
    private renderVerificationPopup(openVerification) {
        if (openVerification) {
            this.showNode(Popup.PFVerification);
        } else {
            this.onClose();
        }
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openCS: boolean) => handle.handleClientSeedPopup(openCS))
    private closeClientSeedSetting() {
        return false;
    }

    onClose() {
        super.onClose();
        this.closeClientSeedSetting();
    }
}
