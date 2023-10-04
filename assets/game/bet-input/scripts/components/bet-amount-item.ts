import { _decorator, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "../handlers/bet-input-handlers";

const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass
export class BetAmountItem extends ObserverComponent {
    @property(Label)
    betAmount: Label = null;

    setBetAmountItem(amount: string) {
        this.node.name = amount;
        this.betAmount.string = `+${amount}`;
    }

    @handle(BetInputHandler, (handle, amount: number) => handle.setBetAmountTemp(amount))
    onBetAmountItemClick(event) {
        return +event.target.name;
    }
}
