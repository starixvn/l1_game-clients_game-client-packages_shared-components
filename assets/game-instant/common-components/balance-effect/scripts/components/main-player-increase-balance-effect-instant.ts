import { _decorator } from "cc";
import Observer from "observer";
import { BalanceContainerInstant } from "./balance-effect-instant";
import { BalanceEffectStore, TUpdateBalance } from "../../../../../game/balance-effect/scripts/stores/balance-effect-store";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerIncreaseBalanceEffectInstant extends BalanceContainerInstant {
    @render(BalanceEffectStore, (store) => store.increaseBalanceMainPlayer, { fireImmediately: false })
    increaseBalanceMainPlayer(balanceWhenMainPlayerPayout: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerPayout?.balanceEffect);
    }
}
