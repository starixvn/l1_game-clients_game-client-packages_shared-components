import inversify from "inversify";
import { UpdatingBalanceContainer } from "../components/updating-balance-container";
import { WinningEffectContainer } from "../components/winning-effect-container";
import { BalanceEffectStore } from "../stores/balance-effect.store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class SetBalanceContainer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balanceContainer: UpdatingBalanceContainer) {
            this.balanceEffectStore.balanceContainer = balanceContainer;
        }
    }

    @injectable()
    export class WinningContainer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(winningContainer: WinningEffectContainer) {
            this.balanceEffectStore.winningContainer = winningContainer;
        }
    }
}
