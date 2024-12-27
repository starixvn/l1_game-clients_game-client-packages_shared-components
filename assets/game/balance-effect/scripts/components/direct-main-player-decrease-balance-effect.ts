import { _decorator, Node } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class DirectMainPlayerDecreaseBalanceEffect extends BalanceContainer {
    @property(Node)
    parentNode: Node = null;

    isIncrease = false;
    @render(BalanceEffectStore, (store) => store.decreaseBalanceMainPlayer, { fireImmediately: false })
    decreaseBalanceMainPlayer(balanceWhenMainPlayerBet: TUpdateBalance) {
        this.updateBalanceEffect(this.parentNode, balanceWhenMainPlayerBet?.balanceEffect?.balance);
    }
}
