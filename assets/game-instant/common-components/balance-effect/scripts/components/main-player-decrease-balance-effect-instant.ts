import { _decorator } from "cc";
import Observer from "observer";
import { BalanceContainerInstant } from "./balance-effect-instant";
import { BalanceEffectStore, TUpdateBalance } from "../../../../../game/balance-effect/scripts/stores/balance-effect-store";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerDecreaseBalanceEffectInstant extends BalanceContainerInstant {
    isIncrease = false;
    @render(BalanceEffectStore, (store) => store.decreaseBalanceMainPlayer, { fireImmediately: false })
    decreaseBalanceMainPlayer(balanceWhenMainPlayerBet: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerBet?.balanceEffect);
    }
}
