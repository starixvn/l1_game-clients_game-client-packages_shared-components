import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "../handlers/bet-input-handlers";

const { ccclass, property } = _decorator;
const { handle } = Observer;
@ccclass
export class BetAmountItem extends ObserverComponent {
    @property(Label)
    lblBetAmount: Label = null;

    setBetAmountItem(amount: string) {
        this.node.name = amount;
        this.lblBetAmount.string = `+${gc.FormatUtils.nFormatter(+amount)}`;
    }

    @handle(BetInputHandler, (handle, amount: number) => handle.setBetAmountTemp(amount))
    private onClickBetAmountItem(event) {
        return +event.target.name;
    }
}
