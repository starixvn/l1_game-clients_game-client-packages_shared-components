import { _decorator, CCFloat } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { UpdatingBalanceContainer } from "./updating-balance-container";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class UpdatingBalanceMainPlayer extends UpdatingBalanceContainer {
    @property({ type: CCFloat, override: true })
    duration: number = 3;

    @property({ override: true })
    startY = 80;

    @property({ override: true })
    destY = 10;

    @render(BalanceEffectStore, (store) => store.payoutBalanceMainPlayer, { fireImmediately: false })
    updateBalanceWhenMainPlayerPayout(balanceWhenMainPlayerPayout: TUpdateBalance) {
        if (balanceWhenMainPlayerPayout) {
            const { avatarNode, balance } = balanceWhenMainPlayerPayout.balanceEffect;
            this.updateBalance(avatarNode, true, balance);
        }
    }
}
