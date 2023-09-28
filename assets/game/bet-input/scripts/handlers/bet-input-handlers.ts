import gc from "@sg/game-client-base";
import inversify from "inversify";

import { BetAmountStore } from "../stores/bet-amount-store";

const { injectable, inject } = inversify;

@injectable()
export class BetInputHandler implements gc.Shared.IHandler<number> {
    @inject(BetAmountStore) private readonly betAmountStore: BetAmountStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    handle(amount = 0) {
        const calcAmount = this.betAmountStore.betAmount + amount;
        const validatedAmount = calcAmount > this.gameConfig.maxBet ? this.gameConfig.maxBet : calcAmount;
        this.betAmountStore.betAmount = validatedAmount;
    }

    quickChangeBetAmount(isIncrease: boolean) {
        const chips = this.gameConfig.chips;
        let index = chips.findIndex((chip) => +chip === this.betAmountStore.betAmount);
        index += isIncrease
            ? this.betAmountStore.betAmount + this.gameConfig.minBet
            : this.betAmountStore.betAmount - this.gameConfig.minBet;
        if (index < 0 || index > chips.length - 1) {
            return;
        }

        this.betAmountStore.betAmount = +this.gameConfig.chips[index];
    }
}
