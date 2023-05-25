import inversify from "inversify";
import { BalanceEffectStore, TBalanceEffect } from "../stores/balance-effect.store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class UpdateBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balanceEffect: TBalanceEffect) {
            this.balanceEffectStore.handleUpdateBalance(balanceEffect);
        }
    }

    @injectable()
    export class PlayWinningEffect {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(status: boolean) {
            this.balanceEffectStore.handlePlayWinningEffect(status);
        }
    }
}
