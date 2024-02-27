import { Label, Node, _decorator } from "cc";
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

    @property(Node)
    nodeDisabledVerification: Node = null;

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
        const { serverSeed, serverSeedHash, mergeClientSeed, finalHash, clientSeeds, result, roundId } = verification;
        console.log("renderVerification", verification);
        this.lblRoundId.string = roundId.toString();
        result && (this.lblResult.string = `${result}x`);

        serverSeed && this.lblServerSeed.setString(serverSeed);
        this.lblServerSeed.setActive(!!serverSeed);

        serverSeedHash && this.lblServerSeedHash.setString(serverSeedHash);
        this.lblServerSeedHash.setActive(!!serverSeedHash);

        mergeClientSeed && this.lblMergeClientSeed.setString(mergeClientSeed);
        this.lblMergeClientSeed.setActive(!!mergeClientSeed);

        finalHash && this.lblFinalHash.setString(finalHash);
        this.lblFinalHash.setActive(!!finalHash);
        this.listClientSeedInfo.forEach((clientSeedInfo) => {
            clientSeedInfo.activeDisabledBg(true);
        });
        if (clientSeeds && clientSeeds.length > 0) {
            clientSeeds.forEach((clientSeed, index) => {
                const info = this.listClientSeedInfo[index];
                info.setDisplay(clientSeed);
                info.activeDisabledBg(false);
            });
        }
        this.nodeDisabledVerification.active = !result;
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
