import { Label, _decorator } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { LabelCopyComponent } from "../../../shared/common-components/copy-label/scripts/label-copy-component";
import { ClientSeedInfo } from "./client-seed-info";
import { IconInfoPopup } from "./icon-info-popup";
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

    @property(Label)
    lblParaVerification: Label = null;

    @property({ type: ClientSeedInfo })
    listClientSeedInfo: ClientSeedInfo[] = [];

    @property({ type: IconInfoPopup })
    listTooltip: IconInfoPopup[] = [];

    onLoad() {
        super.onLoad();
        const para = `${gc.Translator.commonTranslate("pf_provably_fair_para_2")} https://www.provablyfair.io/`;
        this.lblParaVerification.string = para;
    }

    @render(gc.GameCrash.ProvablyFair.PFVerificationStore, (store) => store.verification)
    private renderVerification(verification: gc.GameServiceMessage.ProvablyFair) {
        if (!verification) {
            return;
        }
        this.lblRoundId.string = verification.roundId.toString();
        verification.result && (this.lblResult.string = `${verification.result}x`);

        verification.serverSeed && this.lblServerSeed.setString(verification.serverSeed);
        this.lblServerSeed.setActive(!!verification.serverSeed);

        verification.serverSeedHash && this.lblServerSeedHash.setString(verification.serverSeedHash);
        this.lblServerSeedHash.setActive(!!verification.serverSeedHash);

        verification.mergeClientSeed && this.lblMergeClientSeed.setString(verification.mergeClientSeed);
        this.lblMergeClientSeed.setActive(!!verification.mergeClientSeed);

        verification.finalHash && this.lblFinalHash.setString(verification.finalHash);
        this.lblFinalHash.setActive(!!verification.finalHash);
        this.listClientSeedInfo.forEach((clientSeedInfo) => {
            clientSeedInfo.activeDisabledBg(true);
        });
        if (verification.clientSeeds && verification.clientSeeds.length > 0) {
            verification.clientSeeds.forEach((clientSeed, index) => {
                const info = this.listClientSeedInfo[index];
                info.setDisplay(clientSeed);
                info.activeDisabledBg(false);
            });
        }
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle) => handle.closeVerification())
    onClickClose() {}

    clickGuideClientSeed() {
        this.listTooltip[1].setDisplayTooltip(false);
    }

    clickGuideCombinedHash() {
        this.listTooltip[0].setDisplayTooltip(false);
    }
}
