import { _decorator, Button, Component, instantiate, Label, Node, Prefab, UIOpacity } from "cc";

import { BetAmountPopup } from "./components/bet-amount-popup";

const { ccclass, property } = _decorator;

@ccclass()
export class BetInput extends Component {
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
    gameConfigs = { chips: ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"], minBet: 1, maxBet: 2000 };
    betAmount = 1;

    onLoad() {
        this.updateBetAmount(this.betAmount);
        this.handleBetButtons();
        this.initBetAmountPopup();
    }

    initBetAmountPopup() {
        const node = instantiate(this.prfBetAmountPopup);
        this.nodeBetAmountPopup.addChild(node);

        this.cpnBetAmountPopup = node.getComponent(BetAmountPopup);
        this.cpnBetAmountPopup.node.active = false;
        this.cpnBetAmountPopup.gameConfigs = this.gameConfigs;
        this.cpnBetAmountPopup.initBetAmount();
    }

    onStakeChange() {
        this.cpnBetAmountPopup.node.active = true;
        this.cpnBetAmountPopup.updateBetAmount(this.betAmount);
        this.cpnBetAmountPopup.onBetAmountCallBack = (amount) => {
            this.updateBetAmount(amount);
            this.handleBetButtons();
        };
    }

    updateBetAmount(amount: number) {
        this.betAmount = amount;
        this.lblBetAmount.string = `${amount}`;
    }

    onStakeQuickChange(event) {
        const increase = event.target.name === "increase";
        const chips = this.gameConfigs.chips;
        let index = chips.findIndex((chip) => +chip === this.betAmount);
        index += increase ? 1 : -1;
        if (index < 0 || index > chips.length - 1) {
            return;
        }

        this.updateBetAmount(+chips[index]);
        this.handleBetButtons();
    }

    handleBetButtons() {
        this.handleStakeButtonQuickChange(this.btnDecrease, this.betAmount > +this.gameConfigs.chips[0]);
        this.handleStakeButtonQuickChange(this.btnIncrease, this.betAmount < +this.gameConfigs.chips[this.gameConfigs.chips.length - 1]);
    }

    handleStakeButtonQuickChange(button: Button, condition: boolean) {
        button.interactable = condition;
        button.node.getComponent(UIOpacity).opacity = condition ? 255 : 100;
    }
}
