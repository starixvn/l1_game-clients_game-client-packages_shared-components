import { _decorator, Button, instantiate, Label, Node, Prefab, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "./handlers/bet-input-handlers";
import { BetInputStore } from "./stores/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass()
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
    nodeBetAmountPopup: Node = null;

    @property(Node)
    nodeOverlay: Node = null;

    onLoad() {
        super.onLoad();
        this.initBetAmountPopup();
    }

    initBetAmountPopup() {
        const node = instantiate(this.prfBetAmountPopup);
        this.nodeBetAmountPopup.addChild(node);
        this.nodeBetAmountPopup.children[0].active = false;
    }

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(amount: number) {
        if (amount > 0) {
            this.lblBetAmount.string = `${amount}`;
        }
    }

    @render(BetInputStore, (store) => store.betInputButtonStatus)
    handleBetButtons(buttonStatus) {
        this.handleStakeButtonQuickChange(this.btnDecrease, buttonStatus.descreaseStatus);
        this.handleStakeButtonQuickChange(this.btnIncrease, buttonStatus.increaseStatus);
    }

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    setOverlayVisibility(status: boolean) {
        this.nodeOverlay.active = status;
    }

    @handle(BetInputHandler, (handle) => handle.openBetAmountPopup())
    onStakeChange() {}

    @handle(BetInputHandler, (handle, isIncrease: boolean) => handle.quickChangeBetAmount(isIncrease))
    onStakeQuickChange(event) {
        return event.target.name === "increase";
    }

    @handle(BetInputHandler, (handle) => handle.closeBetAmountPopup())
    onCloseClick(event) {}

    handleStakeButtonQuickChange(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }
}
