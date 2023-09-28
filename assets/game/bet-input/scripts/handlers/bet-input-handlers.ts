import gc from "@sg/game-client-base";
import inversify from "inversify";

import { BetInputStore } from "../stores/bet-input-store";

const { injectable, inject } = inversify;

@injectable()
export class BetInputHandler implements gc.Shared.IHandler<number> {
    @inject(BetInputStore) private readonly betInputStore: BetInputStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    handle(amount: number) {
        const calcAmount = this.betInputStore.betAmount + amount;
        const validatedAmount = calcAmount > this.gameConfig.maxBet ? this.gameConfig.maxBet : calcAmount;
        this.betInputStore.betAmount = validatedAmount;
        this.checkStatusDescreaseAndIncreaseButtons(validatedAmount);
    }

    resetBetAmount(amount: number) {
        this.betInputStore.betAmount = amount;
    }

    openBetAmountPopup(status: boolean) {
        this.betInputStore.isOpenBetAmountPopup = status;
    }

    quickChangeBetAmount(isIncrease: boolean) {
        const amount = isIncrease
            ? this.betInputStore.betAmount + this.gameConfig.minBet
            : this.betInputStore.betAmount - this.gameConfig.minBet;

        this.checkStatusDescreaseAndIncreaseButtons(amount);

        if (amount < this.gameConfig.minBet || amount > this.gameConfig.maxBet) {
            return;
        }

        this.betInputStore.betAmount = amount;
    }

    private checkStatusDescreaseAndIncreaseButtons(amount: number) {
        const isBtnDisabledDescrease = amount > this.gameConfig.minBet;
        const isBtnDisabledIncrease = amount < this.gameConfig.maxBet;

        this.betInputStore.descreaseStatus = isBtnDisabledDescrease;
        this.betInputStore.increaseStatus = isBtnDisabledIncrease;
    }
}
