import { _decorator, Button, instantiate, Label, Node, Prefab, UIOpacity } from "cc";
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

    @property(Prefab)
    prfBetAmountPopup = null;

    @property(Node)
    nodeBetAmountPopupContainer: Node = null;

    @property(Node)
    nodeOverlay: Node = null;

    private initBetAmountPopup() {
        if (this.nodeBetAmountPopupContainer.children.length > 0) {
            return;
        }
        const node = instantiate(this.prfBetAmountPopup);
        this.nodeBetAmountPopupContainer.addChild(node);
    }

    @render(BetInputStore, (store) => store.betAmount)
    private updateBetAmount(amount: number) {
        if (amount > 0) {
            this.lblBetAmount.string = `${amount}`;
        }
    }

    @render(BetInputStore, (store) => store.increaseStatus)
    private setIncreaseButtonStatus(increaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnIncrease, increaseStatus);
    }

    @render(BetInputStore, (store) => store.descreaseStatus)
    private setDecreaseButtonStatus(descreaseStatus: boolean) {
        this.handleStakeButtonQuickChange(this.btnDecrease, descreaseStatus);
    }

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private renderOpenBetAmountPopup(isOpenBetAmountPopup: boolean) {
        this.nodeOverlay.active = isOpenBetAmountPopup;
        this.initBetAmountPopup();
    }

    @handle(BetInputHandler, (handle) => handle.openBetAmountPopup())
    private onClickOpenBetAmountPopup() {}

    @handle(BetInputHandler, (handle, isIncrease: boolean) => handle.quickChangeBetAmount(isIncrease))
    private onClickBetAmountQuickChange(event) {
        return event.target.name === "increase";
    }

    @handle(BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onClickCloseBetAmountPopup(event) {}

    private handleStakeButtonQuickChange(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }
}
