import inversify from "inversify";
import { BalanceEffectStore } from "../stores/balance-effect.store";

const { injectable, inject } = inversify;

export namespace BalanceEffectHandlers {
    @injectable()
    export class UpdateBalanceWhenBet {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updateBalanceWhenBet(balance);
        }
    }

    @injectable()
    export class UpdateBalanceWhenPayout {
        @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;

        async handle(balance: number) {
            this.balanceEffectStore.updateBalanceWhenPayout(balance);
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
