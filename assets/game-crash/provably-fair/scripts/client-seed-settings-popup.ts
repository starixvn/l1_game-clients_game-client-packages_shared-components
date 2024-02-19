import gc from "@sg/game-client-base";
import { Label, Node, Prefab, Toggle, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ClientSeedManualPopup } from "./client-seed-manual-popup";
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
        const clientSeedManualPopup = node.getComponent(ClientSeedManualPopup);
        //const manualValue = this.lblManualClientSeed.string === "" ? this.lblRandomClientSeed.string : this.lblManualClientSeed.string;
        //clientSeedManualPopup.setClientSeedValue(manualValue);
        this.nodeManualPopup.addChild(node);
    }

    clickChangeBtn() {
        this.openManualSettingPopup();
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, isClickPFIcon: boolean) => handle.handleIsClickPFIcon(isClickPFIcon))
    checkIsClickPFIcon() {
        return false;
    }
}
