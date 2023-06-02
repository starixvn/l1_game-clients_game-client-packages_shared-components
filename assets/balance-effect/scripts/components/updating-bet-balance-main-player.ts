import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect.store";
import { UpdatingBalanceContainer } from "./updating-balance-container";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class UpdatingBalanceMainPlayer extends UpdatingBalanceContainer {
    @property({ override: true })
    startY = 80;

    @render(BalanceEffectStore, (store) => store.betBalanceMainPlayer, { fireImmediately: false })
    updateBalanceWhenMainPlayerBet(balanceWhenMainPlayerBet: TUpdateBalance) {
        if (balanceWhenMainPlayerBet) {
            const { avatarNode, balance } = balanceWhenMainPlayerBet.balanceEffect;
            this.updateBalance(avatarNode, false, balance);
        }
    }
}
