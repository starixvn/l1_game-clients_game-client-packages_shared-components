import inversify from "inversify";
import { BalanceEffectStore, TBalanceEffect, TWinningEffect } from "../stores/balance-effect-store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class MainPlayerDecreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.mainPlayerUpdateDecreaseBalance(balance);
        }
    }

    @injectable()
    export class MainPlayerIncreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.mainPlayerUpdateIncreaseBalance(balance);
        }
    }

    @injectable()
    export class MainPlayerUpdateWinEffect {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(status: boolean) {
            this.balanceEffectStore.mainPlayerUpdateWinEffect(status);
        }
    }
    @injectable()
    export class AroundTablePlayersUpdateWinEffect {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(winningEffects: TWinningEffect[]) {
            this.balanceEffectStore.aroundTablePlayersUpdateWinEffect(winningEffects);
        }
    }

    @injectable()
    export class AroundTablePlayersUpdateIncreaseBalance {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balanceEffects: TBalanceEffect[]) {
            this.balanceEffectStore.aroundTablePlayersUpdateDecreaseBalance(balanceEffects);
        }
    }
}
