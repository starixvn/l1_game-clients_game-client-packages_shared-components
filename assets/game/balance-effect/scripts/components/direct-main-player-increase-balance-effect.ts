import { _decorator, Node } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerIncreaseBalanceEffect extends BalanceContainer {
    @property(Node)
    parentNode: Node = null;

    @render(BalanceEffectStore, (store) => store.increaseBalanceMainPlayer, { fireImmediately: false })
    increaseBalanceMainPlayer(balanceWhenMainPlayerPayout: TUpdateBalance) {
        this.updateBalanceEffect(this.parentNode, balanceWhenMainPlayerPayout?.balanceEffect?.balance);
    }
}
