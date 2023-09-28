import { _decorator, Button, instantiate, Label, Node, Prefab, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { BetAmountPopup } from "./components/bet-amount-popup";
import { BetInputHandler } from "./handlers/bet-input-handlers";
import { BetAmountStore } from "./stores/bet-amount-store";

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

    cpnBetAmountPopup: BetAmountPopup;
    protected betAmount = 1;

    onLoad() {
        super.onLoad();
        this.handleBetButtons();
        this.initBetAmountPopup();
    }

    @render(BetAmountStore, (store) => store.betAmount)
    updateBetAmount(amount: number) {
        this.betAmount = amount;
        this.lblBetAmount.string = `${amount}`;
        this.handleBetButtons();
    }

    initBetAmountPopup() {
        const node = instantiate(this.prfBetAmountPopup);
        this.nodeBetAmountPopup.addChild(node);
        this.nodeBetAmountPopup.children[0].active = false;
    }

    onStakeChange() {
        this.nodeBetAmountPopup.children[0].active = true;
    }

    @handle(BetInputHandler, (handle, isIncrease: boolean) => handle.quickChangeBetAmount(isIncrease))
    onStakeQuickChange(event) {
        return event.target.name === "increase";
    }

    handleBetButtons() {
        // this.handleStakeButtonQuickChange(this.btnDecrease, this.betAmount > +this.gameConfigs.chips[0]);
        // this.handleStakeButtonQuickChange(this.btnIncrease, this.betAmount < +this.gameConfigs.chips[this.gameConfigs.chips.length - 1]);
    }

    handleStakeButtonQuickChange(button: Button, condition: boolean) {
        button.interactable = condition;
        button.node.getComponent(UIOpacity).opacity = condition ? 255 : 100;
    }
}
