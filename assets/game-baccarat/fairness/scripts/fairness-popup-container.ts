import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { MultipleNodeContainer } from "../../../shared/common-components/node-container/multiple-node-container";
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX } = gc;
const { render, handle } = Observer;

enum Popup {
    ClientSeedSetting = "ClientSeedSetting",
    FairnessVerification = "FairnessVerification",
    CutCardIndex = "CutCardIndex",
}

@ccclass
export class FairnessPopupContainer extends MultipleNodeContainer {
    @render(CutCardPF.FairnessStore, (store) => store.openCutCardIndex, { fireImmediately: false })
    renderCutCardIndexPopup(openCutCardIndex: boolean) {
        if (openCutCardIndex) {
            this.showNode(Popup.CutCardIndex);
        } else {
            this.onClose();
        }
    }

    @render(CutCardPF.FairnessStore, (store) => store.isShowFairnessSettingsPopup, { fireImmediately: false })
    renderClientSeedSettingPopup(isShowFairnessSettingsPopup: boolean) {
        if (isShowFairnessSettingsPopup) {
            this.showNode(Popup.ClientSeedSetting);
        } else {
            this.onClose();
        }
    }

    @render(CutCardPF.FairnessStore, (store) => store.openVerification, { fireImmediately: false })
    renderOpenVerificationPopup(openVerification: boolean) {
        if (openVerification) {
            this.showNode(Popup.FairnessVerification);
        } else {
            this.onClose();
        }
    }
}
