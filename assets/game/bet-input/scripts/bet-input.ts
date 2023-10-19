import { _decorator, Button, Label, Node, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "./handlers/bet-input-handlers";
import { BetInputStore } from "./stores/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class BetInput extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    @property(Button)
    btnDecrease: Button = null;

    @property(Button)
    btnIncrease: Button = null;

    @property(Node)
    nodeDisabledLayer: Node = null;

    @render(BetInputStore, (store) => store.isDisabledBetInput)
    private setDisabledLayerVisibility(isDisabledBetInput: boolean) {
        this.nodeDisabledLayer.active = isDisabledBetInput;
    }

    @render(BetInputStore, (store) => store.betAmountRatio)
    private updateBetAmount(amount: number) {
        this.lblBetAmount.string = `${amount}`;
    }

    @render(BetInputStore, (store) => store.increaseStatus)
    private setIncreaseButtonStatus(increaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnIncrease, increaseStatus);
    }

    @render(BetInputStore, (store) => store.descreaseStatus)
    private setDecreaseButtonStatus(descreaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnDecrease, descreaseStatus);
    }

    @handle(BetInputHandler, (handle) => handle.openBetAmountPopup())
    private onClickOpenBetAmountPopup() {}

    @handle(BetInputHandler, (handle, isIncrease: boolean) => handle.quickChangeBetAmount(isIncrease))
    private onClickBetAmountQuickChange(event) {
        return event.target.name === "increase";
    }

    private handleStakeButtonQuickChange(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }
}
