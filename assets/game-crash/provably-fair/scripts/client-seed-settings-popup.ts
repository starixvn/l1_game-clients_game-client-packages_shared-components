import gc from "@sg/game-client-base";
import { Label, Node, Prefab, Toggle, UIOpacity, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { GameCrash } = gc;
const { render, handle } = Observer;

@ccclass
export class ClientSeedSettingsPopup extends ObserverComponent {
    @property(Label)
    lblRandomClientSeed: Label = null;

    @property(Label)
    lblManualClientSeed: Label = null;

    @property(Toggle)
    tglRandomClientSeed: Toggle = null;

    @property(Toggle)
    tglManualClientSeed: Toggle = null;

    @property(Prefab)
    prfClientSeedManual: Prefab = null;

    @property(Node)
    nodeManualPopup: Node = null;

    @property(Node)
    nodeOverlayChangeBtn: Node = null;

    @property(Node)
    nodeRandomLabelDisabledBg = null;

    @property(Node)
    nodeManualLabelDisabledBg = null;

    @property(Node)
    nodeWarningText = null;

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.openClientSeedPopup)
    openSettingsPopup(openClientSeedPopup: boolean) {
        this.node.active = openClientSeedPopup;
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openCS: boolean) => handle.handleClientSeedPopup(openCS))
    closeSettingsPopup() {
        this.checkIsClickPFIcon();
        return false;
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.randomClientSeed)
    displayClientSeed(randomClientSeed: string) {
        this.lblRandomClientSeed.string = randomClientSeed;
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.randomClientSeedEnabled)
    updateRandomMode(randomClientSeedEnabled: boolean) {
        if (!randomClientSeedEnabled) {
            this.nodeOverlayChangeBtn.active = false;
            this.tglManualClientSeed.isChecked = true;
        } else {
            this.nodeOverlayChangeBtn.active = true;
            this.tglRandomClientSeed.isChecked = true;
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.randomClientSeedEnabled, { fireImmediately: false })
    resetIsClickPFIcon() {
        this.checkIsClickPFIcon();
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.showManualClientSeedPopup)
    setDisplayManualClientSeedPopup(showManualClientSeedPopup: boolean) {
        if (showManualClientSeedPopup) {
            this.openManualSettingPopup();
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.manualClientSeed)
    updateManualClientSeed(manualClientSeed: string) {
        if (manualClientSeed === "") {
            this.lblManualClientSeed.string = "";
        } else {
            this.lblManualClientSeed.string = manualClientSeed;
        }
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isRandom: boolean) => handle.clientSeedGenerationMode(isRandom))
    clickManualMode() {
        return false;
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isRandom: boolean) => handle.clientSeedGenerationMode(isRandom))
    clickRandomMode() {
        return true;
    }

    openManualSettingPopup() {
        const node = instantiate(this.prfClientSeedManual);
        this.nodeManualPopup.addChild(node);
    }

    clickChangeBtn() {
        this.openManualSettingPopup();
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isClickPFIcon: boolean) => handle.handleIsClickPFIcon(isClickPFIcon))
    checkIsClickPFIcon() {
        return false;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState, { fireImmediately: false })
    closePopup(buttonState: string) {
        if (buttonState === GameCrash.ButtonState.BET_ACCEPTED) {
            this.closeSettingsPopup();
        }
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.notAllowChangeClientSeed)
    setOpacityComponents(notAllowChangeClientSeed: boolean) {
        if (notAllowChangeClientSeed) {
            this.nodeRandomLabelDisabledBg.active = true;
            this.nodeManualLabelDisabledBg.active = true;
            this.nodeOverlayChangeBtn.active = true;
            this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = 153;
            this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = 153;
            this.tglManualClientSeed.interactable = false;
            this.tglRandomClientSeed.interactable = false;
            this.nodeWarningText.active = true;
        } else {
            this.nodeRandomLabelDisabledBg.active = false;
            this.nodeManualLabelDisabledBg.active = false;
            this.nodeOverlayChangeBtn.active = false;
            this.tglManualClientSeed.node.getComponent(UIOpacity).opacity = 255;
            this.tglRandomClientSeed.node.getComponent(UIOpacity).opacity = 255;
            this.tglManualClientSeed.interactable = true;
            this.tglRandomClientSeed.interactable = true;
            this.nodeWarningText.active = false;
        }
    }
}
