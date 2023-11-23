import gc from "@sg/game-client-base";
import { _decorator, Button, Color, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { PopupsHandlers } from "../../../popups/popups-handlers";
import AutoCashOutHandler from "../handlers/auto-cash-out-handler";
import AutoCashOutPopupHandler from "../handlers/auto-cash-out-popup-handler";
import AutoCashOutPopupStore from "../stores/auto-cash-out-popup-store";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashoutPopup extends ObserverComponent {
    @property(Label)
    multiplierLabel: Label = null;

    @property(Label)
    multiplierRangeLabel: Label = null;

    @property(Node)
    nodeContent: Node = null;

    @property(Button)
    confirmButton: Button = null;

    @handle(AutoCashOutPopupHandler, (handle) => handle.togglePopup(false))
    close() {}

    @handle(AutoCashOutHandler, (handle, multiplier: number) => handle.handleMultiplier(multiplier))
    @handle(AutoCashOutPopupHandler, (handle) => {
        handle.togglePopup(false);
        handle.handleMultiplier("0");
    })
    confirm() {
        return parseFloat(this.removeCommasMultiplier());
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    addValue(event, value) {
        const multiplier = this.removeCommasMultiplier();

        if (multiplier === "0" && value !== ".") {
            return value;
        }

        const regex = new RegExp(/^[1-9]\d{0,3}(\.\d{0,2})?$/);
        const newValue = `${multiplier}${value}`;

        if (regex.test(newValue)) {
            return newValue;
        }

        return multiplier;
    }

    @render(AutoCashOutPopupStore, (store) => store.multiplier)
    updateMultiplierString(multiplier: string) {
        let slitStr;
        if (multiplier.split(".")[1] === "") {
            slitStr = ".";
        } else if (multiplier.split(".")[1] === "0") {
            slitStr = ".0";
        } else {
            slitStr = "";
        }

        this.multiplierLabel.string = `${FormatUtils.numberWithCommas(+multiplier, 2)}${slitStr}`;
    }

    @render(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore, (store) => store.maxMultiplier)
    updateMultiplierRangeLabel(maxMultiplier: number) {
        this.multiplierRangeLabel.string = `1.01x - ${FormatUtils.numberWithCommas(maxMultiplier, 2)}x`;
    }

    @render(AutoCashOutPopupStore, (store) => store.isValid)
    updateMultiplierTextColor(isValid: boolean) {
        this.multiplierLabel.color = isValid ? Color.fromHEX(this.multiplierLabel.color, "#4920A4") : Color.RED;
        this.confirmButton.interactable = isValid;
        this.confirmButton.node.getChildByName("overlay").active = !isValid;
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    removeLastLetter() {
        let multiplierString = this.removeCommasMultiplier().slice(0, -1);
        if (!multiplierString) {
            multiplierString = "0";
        }

        return multiplierString;
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    clear() {
        return "0";
    }

    @render(AutoCashOutPopupStore, (store) => store.enable)
    showHideAutoCashoutPopup(enable: boolean) {
        this.node.active = enable;
        enable && this.closeOtherPopups();
    }

    @handle(PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutAutoCashOut())
    closeOtherPopups() {}

    private removeCommasMultiplier(): string {
        return this.multiplierLabel.string.replace(",", "");
    }
}
