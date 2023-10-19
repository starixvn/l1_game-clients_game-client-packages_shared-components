import { _decorator, Button, Label, Sprite, Toggle, UIOpacity } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import AutoCashOutHandler from "../handlers/auto-cash-out-handler";
import AutoCashOutStore from "../stores/auto-cash-out-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class AutoCashout extends ObserverComponent {
    @property(Label)
    multiplierLabel: Label = null;

    @property(Toggle)
    toggle: Toggle = null;

    @property(Sprite)
    disableMultiplier: Sprite = null;

    @property(Button)
    increaseButton: Button = null;

    @property(Button)
    decreaseButton: Button = null;

    @handle(AutoCashOutHandler, (handle, enable: boolean) => handle.handleEnable(enable))
    toggleCheck() {
        return this.toggle.isChecked;
    }

    @handle(AutoCashOutHandler, (handle, value: number) => handle.adjustMultiplier(value))
    quickChangeMultiplier(value: number) {
        return value;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    private updateMultiplier(multiplier: number) {
        this.multiplierLabel.string = `${multiplier}X`;
        this.updateButtonStatus(this.decreaseButton, multiplier > 1.01);
    }

    @render(AutoCashOutStore, (store) => store.enable)
    private updateEnable(enable: boolean) {
        this.toggle.isChecked = enable;
        this.disableMultiplier.node.active = !enable;
    }

    updateButtonStatus(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }

    increaseMultiplier() {
        return this.quickChangeMultiplier(0.01);
    }

    decreaseMultiplier() {
        return this.quickChangeMultiplier(-0.01);
    }
}
