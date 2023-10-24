import gc from "@sg/game-client-base";
import inversify from "inversify";

import { BetInputStore } from "../stores/bet-input-store";

const { injectable, inject } = inversify;

@injectable()
export class BetInputHandler implements gc.Shared.IHandler<number> {
    @inject(BetInputStore) private readonly betInputStore: BetInputStore;
    @inject(gc.CrashGameConfigStore) private readonly gameConfig: gc.CrashGameConfigStore;

    handle() {
        this.betInputStore.betAmount = this.betInputStore.betAmountTemp;
        this.betInputStore.isOpenBetAmountPopup = false;
    }

    setBetAmountTemp(amount: number) {
        const calcAmount = this.betInputStore.betAmountTemp + amount;
        const validatedAmount = calcAmount > this.gameConfig.maxBet ? this.gameConfig.maxBet : calcAmount;

        this.betInputStore.betAmountTemp = validatedAmount;
    }

    resetBetAmount() {
        this.betInputStore.betAmountTemp = 0;
    }

    openBetAmountPopup() {
        this.betInputStore.betAmountTemp = this.betInputStore.betAmount;
        this.betInputStore.isOpenBetAmountPopup = true;
    }

    closeBetAmountPopup() {
        this.betInputStore.isOpenBetAmountPopup = false;
    }

    quickChangeBetAmount(isIncrease: boolean) {
        const amount = isIncrease
            ? this.betInputStore.betAmount + this.gameConfig.minBet
            : this.betInputStore.betAmount - this.gameConfig.minBet;

        if (amount < this.gameConfig.minBet || amount > this.gameConfig.maxBet) {
            return;
        }

        this.betInputStore.betAmount = amount;
    }
}
