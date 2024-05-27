import { Label, _decorator } from "cc";
import { ClientSeedManualPopup } from "../../../provably-fair/round-base/scripts/client-seed-manual-popup";
const { ccclass, property } = _decorator;

@ccclass
export class ClientSeedManualBaccaratPopup extends ClientSeedManualPopup {
    @property(Label)
    lblMinCSNumber: Label = null;

    @property(Label)
    lblMaxCSNumber: Label = null;

    @property
    minCSNumber = 300;

    @property
    maxCSNumber = 350;

    clientSeedChar = 3;

    onLoad() {
        super.onLoad();
        this.renderRangeCS();
    }

    renderRangeCS() {
        this.lblMaxCSNumber.string = this.maxCSNumber.toString();
        this.lblMinCSNumber.string = this.minCSNumber.toString();
    }

    checkValueCS(newCS: string) {
        console.log("checkValueCS", newCS);
        if (+newCS >= this.minCSNumber && +newCS <= this.maxCSNumber) {
            return false;
        }
        return true;
    }
}
