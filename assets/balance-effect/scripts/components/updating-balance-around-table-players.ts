import { CCFloat, _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalances } from "../stores/balance-effect.store";
import { UpdatingBalanceContainer } from "./updating-balance-container";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { FormatUtils } = gc;

@ccclass()
export class UpdatingBalanceAroundTablePlayers extends UpdatingBalanceContainer {
    @property({ type: CCFloat, override: true })
    duration = 3;

    @property({ override: true })
    startY = 0;

    @property({ override: true })
    destY = 10;

    @render(BalanceEffectStore, (store) => store.payoutBalanceAroundTablePlayers, { fireImmediately: false })
    updateBalanceWhenAroundTablePlayersPayout(payoutBalanceAroundTablePlayers: TUpdateBalances) {
        const { balanceEffects } = payoutBalanceAroundTablePlayers ?? {};
        if (balanceEffects) {
            balanceEffects.forEach((balanceEffect) => {
                const { avatarNode, balance } = balanceEffect;
                this.updateBalance(avatarNode, true, balance);
            });
        }
    }
}
