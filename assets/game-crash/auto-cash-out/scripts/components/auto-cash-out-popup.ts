import gc from "@sg/game-client-base";
import { Button, Color, Label, Node, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import AutoCashOutHandler from "../handlers/auto-cash-out-handler";
import AutoCashOutPopupHandler from "../handlers/auto-cash-out-popup-handler";
import AutoCashOutPopupStore from "../stores/auto-cash-out-popup-store";

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
        return parseFloat(this.multiplierLabel.string);
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    addValue(event, value) {
        console.log(typeof value);
        if (this.multiplierLabel.string === "0" && value !== ".") {
            return value.toString();
        }

        const regex = new RegExp(/^[1-9]\d{0,3}(\.\d{0,2})?$/);
        const newValue = `${this.multiplierLabel.string}${value}`;

        if (regex.test(newValue)) {
            return newValue.toString();
        }

        return this.multiplierLabel.string;
    }

    @render(AutoCashOutPopupStore, (store) => store.multiplier)
    updateMultiplierString(multiplier: string) {
        this.multiplierLabel.string = multiplier;
    }

    @render(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore, (store) => store.maxMultiplier)
    updateMultiplierRangeLabel(maxMultiplier: number) {
        this.multiplierRangeLabel.string = `1.01x - ${maxMultiplier.toFixed(2)}x`;
    }

    @render(AutoCashOutPopupStore, (store) => store.isValid)
    updateMultiplierTextColor(isValid: boolean) {
        this.multiplierLabel.color = isValid ? Color.fromHEX(this.multiplierLabel.color, "#4920A4") : Color.RED;
        this.confirmButton.interactable = isValid;
        this.confirmButton.node.getChildByName("overlay").active = !isValid;
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: string) => handle.handleMultiplier(multiplier))
    removeLastLetter() {
        let multiplierString = this.multiplierLabel.string.slice(0, -1);
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
    }
}
