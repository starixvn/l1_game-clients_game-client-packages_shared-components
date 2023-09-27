import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";

import { BetAmountStore } from "../stores/bet-amount-store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class BetAmountPopup extends Component {
    @property(Node)
    nodeBetContainer: Node = null;

    @property(Prefab)
    prfBetAmount: Prefab = null;

    @property(Label)
    lblBetAmount: Label = null;

    betAmount = 0;
    minBet = 0;

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
        this.updateBetAmount(this.betAmount);
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.minBet)
    upateMinBet(minBet: number) {
        this.minBet = minBet;
    }

    onClearClick() {
        this.updateBetAmount(this.minBet);
    }

    @render(BetAmountStore, (store) => store.betAmount)
    updateBetAmount(amount: number) {
        this.betAmount = amount;
        this.lblBetAmount.string = `${amount}`;
    }

    onCloseClick() {
        this.hidePopup();
    }

    hidePopup() {
        this.node.active = false;
    }
}
