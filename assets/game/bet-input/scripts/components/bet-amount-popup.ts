import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";

import { BetAmountItem } from "./bet-amount-item";

const { ccclass, property } = _decorator;

@ccclass()
export class BetAmountPopup extends Component {
    @property(Node)
    nodeBetContainer: Node = null;

    @property(Prefab)
    prfBetAmount: Prefab = null;

    @property(Label)
    lblBetAmount: Label = null;

    betAmount = 0;
    gameConfigs = null;

    onBetAmountCallBack = (amount) => {};

    initBetAmount() {
        this.nodeBetContainer.destroyAllChildren();
        this.gameConfigs.chips.forEach((chip) => {
            const node = instantiate(this.prfBetAmount);
            node.name = chip;
            const value = node.getChildByName("value");
            value.getComponent(Label).string = `+${chip}`;
            const cpnBetAmount = node.getComponent(BetAmountItem);
            cpnBetAmount.onBetAmountItemCallBack = (amount) => {
                this.updateBetAmount(this.betAmount + amount);
            };
            this.nodeBetContainer.addChild(node);
        });
        this.updateBetAmount(this.betAmount);
    }

    onClearClick() {
        this.updateBetAmount(this.gameConfigs.minBet);
    }

    updateBetAmount(amount: number) {
        const validatedAmount = amount > this.gameConfigs.maxBet ? this.gameConfigs.maxBet : amount;
        this.betAmount = validatedAmount;
        this.lblBetAmount.string = `${validatedAmount}`;
    }

    onCloseClick() {
        this.hidePopup();
        this.onBetAmountCallBack(this.betAmount);
    }

    hidePopup() {
        this.node.active = false;
    }
}
