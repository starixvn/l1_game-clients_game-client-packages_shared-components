import gc from "@sg/game-client-base";
import { _decorator, Button, Label, Sprite, Toggle, UIOpacity } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import AutoCashOutHandler from "../handlers/auto-cash-out-handler";
import AutoCashOutPopupHandler from "../handlers/auto-cash-out-popup-handler";
import AutoCashOutStore from "../stores/auto-cash-out-store";
import { PlayerActionStore } from "../../../player-actions/player-action-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashout extends ObserverComponent {
    @property(Label)
    multiplierLabel: Label = null;

    @property(Toggle)
    toggle: Toggle = null;

    @property(Button)
    increaseButton: Button = null;

    @property(Button)
    decreaseButton: Button = null;

    maxMultiplier: number;

    @property(Sprite)
    disableNode: Sprite = null;

    @handle(AutoCashOutHandler, (handle, enable: boolean) => handle.handleEnable(enable))
    toggleCheck() {
        return this.toggle.isChecked;
    }

    @handle(AutoCashOutHandler, (handle, value: number) => handle.adjustMultiplier(value))
    quickChangeMultiplier(value: number) {
        return value;
    }

    @handle(AutoCashOutPopupHandler, (handle, value: boolean) => handle.togglePopup(value))
    openPopup() {
        return true;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    updateMultiplier(multiplier: number) {
        this.multiplierLabel.string = `${multiplier.toFixed(2)}x`;
        this.updateButtonStatus(this.decreaseButton, multiplier > 1.01);
        this.updateButtonStatus(this.increaseButton, multiplier < this.maxMultiplier);
    }

    @render(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore, (store) => store.maxMultiplier)
    updateMaxMultiplier(maxMultiplier: number) {
        this.maxMultiplier = maxMultiplier;
        const currentMultiplier = parseFloat(this.multiplierLabel.string);
        this.updateButtonStatus(this.decreaseButton, currentMultiplier > 1.01);
        this.updateButtonStatus(this.increaseButton, currentMultiplier < this.maxMultiplier);
    }

    @render(AutoCashOutStore, (store) => store.enable)
    updateEnable(enable: boolean) {
        this.toggle.isChecked = enable;
    }

    @render(AutoCashOutStore, (store) => store.disable)
    isVisibleNode(disable: boolean) {
        this.disableNode.node.active = disable;
    }

    updateButtonStatus(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }

    increaseMultiplier() {
        this.quickChangeMultiplier(0.01);
    }

    decreaseMultiplier() {
        this.quickChangeMultiplier(-0.01);
    }

    @render(PlayerActionStore, (store) => ({
        rocketFlyWithoutCashout: store.rocketFlyWithoutCashout,
        showPlaceBetNextRound: store.showPlaceBetNextRound,
    }))
    showPlaceBetNextRound(data: { rocketFlyWithoutCashout: boolean; showPlaceBetNextRound: boolean }) {
        const { rocketFlyWithoutCashout, showPlaceBetNextRound } = data;
        if (rocketFlyWithoutCashout || showPlaceBetNextRound) {
            this.enableAutoCashOut();
        }
    }

    @handle(AutoCashOutHandler, (handle) => handle.handleDisableAuto(false))
    enableAutoCashOut() {}
}
