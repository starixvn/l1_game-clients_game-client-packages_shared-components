import { _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { BetInputHandler } from "../handlers/bet-input-handlers";

const { ccclass } = _decorator;
const { handle } = Observer;
@ccclass()
export class BetAmountItem extends ObserverComponent {
    @handle(BetInputHandler, (handler, value: number) => handler.handle(value))
    onBetAmountItemClick(event) {
        return +event.target.name;
    }
}
