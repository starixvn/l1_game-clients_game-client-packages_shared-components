import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("bet_item")
export class BetAmountItem extends Component {
    onBetAmountItemCallBack = (amount) => {};

    onBetAmountItemClick(event) {
        this.onBetAmountItemCallBack(+event.target.name);
    }
}
