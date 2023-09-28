import gc from "@sg/game-client-base";
import { _decorator, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "../handlers/bet-input-handlers";
import { BetAmountStore } from "../stores/bet-amount-store";

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
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.minBet)
    upateMinBet(minBet: number) {
        this.minBet = minBet;
    }

    @handle(BetInputHandler)
    onClearClick() {
        this.betAmount = 0;
        return this.betAmount;
    }

    @render(BetAmountStore, (store) => store.betAmount)
    updateBetAmount(amount: number) {
        this.betAmount = amount;
        this.lblBetAmount.string = `${amount}`;
    }

    @handle(BetInputHandler)
    onCloseClick() {
        this.hidePopup();
        return this.betAmount;
    }

    hidePopup() {
        this.node.active = false;
    }
}
