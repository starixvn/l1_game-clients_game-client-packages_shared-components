import inversify from "inversify";
import { BalanceEffectStore, TBalanceEffect, TWinningEffect } from "../stores/balance-effect.store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class UpdateBetBalanceMainPlayer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updateBetBalanceMainPlayer(balance);
        }
    }

    @injectable()
    export class UpdatePayoutBalanceMainPlayer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updatePayoutBalanceMainPlayer(balance);
        }
    }

    @injectable()
    export class UpdateWinEffectMainPlayer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(status: boolean) {
            this.balanceEffectStore.updateWinEffectMainPlayer(status);
        }
    }
    @injectable()
    export class UpdateWinEffectAroundTablePlayer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(winningEffects: TWinningEffect[]) {
            this.balanceEffectStore.updateWinEffectAroundTablePlayer(winningEffects);
        }
    }

    @injectable()
    export class UpdatePayoutBalanceAroundTablePlayer {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balanceEffects: TBalanceEffect[]) {
            this.balanceEffectStore.updatePayoutBalanceAroundTablePlayer(balanceEffects);
        }
    }
}
