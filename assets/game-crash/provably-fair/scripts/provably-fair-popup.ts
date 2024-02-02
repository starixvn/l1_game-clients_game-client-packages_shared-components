import { Label, _decorator } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { LabelCopyComponent } from "../../../shared/common-components/copy-label/scripts/label-copy-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass()
export class ProvablyFairPopup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblResult: Label = null;

    @property(LabelCopyComponent)
    lblServerSeed: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblServerSeedHash: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblMergeClientSeed: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblFinalHash: LabelCopyComponent = null;

    @render(gc.GameCrash.ProvablyFair.PFVerificationStore, (store) => store.verification)
    private renderVerification(verification: gc.GameServiceMessage.ProvablyFair) {
        if (!verification) {
            return;
        }
        this.lblRoundId.string = verification.roundId.toString();
        verification.result && (this.lblResult.string = `${verification.result}x`);
        verification.serverSeed && this.lblServerSeed.setString(verification.serverSeed);
        verification.serverSeedHash && this.lblServerSeedHash.setString(verification.serverSeedHash);
        verification.mergeClientSeed && this.lblMergeClientSeed.setString(verification.mergeClientSeed);
        verification.finalHash && this.lblFinalHash.setString(verification.finalHash);
    }
}
