import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Label, Node, Prefab, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "../handlers/bet-input-handlers";
import { BetInputStore } from "../stores/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass()
export class BetAmountPopup extends ObserverComponent {
    @property(Node)
    nodeBetContainer: Node = null;

    @property(Prefab)
    prfBetAmount: Prefab = null;

    @property(Label)
    lblBetAmount: Label = null;

    @property(Button)
    btnConfirm: Button = null;

    @render(gc.GameConfigs.GameConfigStore, (store) => store.chips)
    initBetAmount(chips) {
        this.nodeBetContainer.destroyAllChildren();
        chips.forEach((chip) => {
            const node = instantiate(this.prfBetAmount);
            node.name = chip;
            const value = node.getChildByName("value");
            value.getComponent(Label).string = `+${chip}`;
            this.nodeBetContainer.addChild(node);
        });
    }

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    setBetAmountPopupVisibilty(status: boolean) {
        this.node.active = status;
    }

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(amount: number) {
        this.lblBetAmount.string = `${amount}`;
        this.checkConfirmBtnStatus(amount > 0);
    }

    @handle(BetInputHandler, (handle, status: boolean) => handle.openBetAmountPopup(status))
    onCloseClick() {
        return false;
    }

    @handle(BetInputHandler, (handler, amount: number) => handler.resetBetAmount(amount))
    onClearClick() {
        return 0;
    }

    private checkConfirmBtnStatus(status: boolean) {
        this.btnConfirm.interactable = status;
        this.btnConfirm.node.getComponent(UIOpacity).opacity = status ? 255 : 100;
    }
}
