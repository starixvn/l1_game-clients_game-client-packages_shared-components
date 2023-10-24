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
    @handle(AutoCashOutPopupHandler, (handle) => handle.togglePopup(false))
    confirm() {
        return parseFloat(this.multiplierLabel.string);
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: number) => handle.handleMultiplier(multiplier))
    addValue(event, value) {
        if (this.multiplierLabel.string === "0") {
            this.multiplierLabel.string = value;
            return parseFloat(value);
        }

        const regex = new RegExp(/^[1-9]\d{0,3}(\.\d{0,2})?$/);
        const newValue = `${this.multiplierLabel.string}${value}`;

        if (regex.test(newValue)) {
            this.multiplierLabel.string = newValue;
            return parseFloat(newValue);
        }

        return parseFloat(this.multiplierLabel.string);
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.maxMultiplier)
    updateMultiplierRangeLabel(maxMultiplier: number) {
        this.multiplierRangeLabel.string = `1.01X - ${maxMultiplier.toFixed(2)}X`;
    }

    @render(AutoCashOutPopupStore, (store) => store.isValid)
    updateMultiplierTextColor(isValid: boolean) {
        this.multiplierLabel.color = isValid ? Color.WHITE : Color.RED;
        this.confirmButton.interactable = isValid;
        this.confirmButton.node.getChildByName("overlay").active = !isValid;
    }

    @handle(AutoCashOutPopupHandler, (handle, multiplier: number) => handle.handleMultiplier(multiplier))
    removeLastLetter() {
        this.multiplierLabel.string = this.multiplierLabel.string.slice(0, -1);
        return parseFloat(this.multiplierLabel.string);
    }

    @handle(AutoCashOutPopupHandler, (handle) => handle.handleMultiplier(0))
    clear() {
        this.multiplierLabel.string = "0";
    }
}
