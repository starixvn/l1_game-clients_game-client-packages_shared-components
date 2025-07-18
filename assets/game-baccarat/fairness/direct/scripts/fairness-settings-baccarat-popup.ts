import { EditBox, Label, _decorator, instantiate } from "cc";
import { ClientSeedManualBaccaratPopup } from "db://shared-components/game-baccarat/fairness/scripts/client-seed-manual-baccarat-popup";
import { FairnessSettingsBaccaratPopup as FairnessSettingsBaccaratPopupBase } from "db://shared-components/game-baccarat/fairness/scripts/fairness-settings-baccarat-popup";
const { ccclass, property } = _decorator;

@ccclass
export class FairnessSettingsBaccaratPopup extends FairnessSettingsBaccaratPopupBase {
    @property(EditBox)
    inputClientSeed: EditBox = null;

    @property({ type: Label, override: true, visible: false })
    lblClientSeed: Label = null;

    showPopupManual() {
        this.playSoundClick();
        const manual = instantiate(this.prfManualSettings);
        const comp = manual.getComponent(ClientSeedManualBaccaratPopup);
        comp.minClientSeed = this.minCSNumber;
        comp.maxClientSeed = this.maxCSNumber;
        comp.renderRangeCS();
        this.nodeManualSettings.addChild(manual);
        comp.setClientSeedValue(this.inputClientSeed.string);
        
    }

    onClickSubmit() {
        this.playSoundClick();
        return this.inputClientSeed.string;
    }

    renderClientSeed(clientSeed: string) {
        this.inputClientSeed.string = clientSeed;
    }

    onClickPrevious() {
        this.playSoundClick();
        let clientSeedTpm = +this.inputClientSeed.string - 1;
        if (clientSeedTpm < this.minCSNumber) {
            clientSeedTpm = this.maxCSNumber;
        }
        this.inputClientSeed.string = clientSeedTpm.toString();
    }

    onClickNext() {
        this.playSoundClick();
        let clientSeedTpm = +this.inputClientSeed.string + 1;
        if (clientSeedTpm > this.maxCSNumber) {
            clientSeedTpm = this.minCSNumber;
        }
        this.inputClientSeed.string = clientSeedTpm.toString();
    }
}
