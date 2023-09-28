import { GameConfigStore } from "@sg/game-client-base/dist/game/game-configs/game-config-store";
import { IHandler } from "@sg/game-client-base/dist/shared";
import inversify from "inversify";

import { BetAmountStore } from "../stores/bet-amount-store";

const { injectable, inject } = inversify;

@injectable()
export class BetInputHandler implements IHandler<number> {
    constructor(
        @inject(BetAmountStore) private readonly betAmountStore: BetAmountStore,
        @inject(GameConfigStore) private readonly gameConfig: GameConfigStore
    ) {}

    handle(amount = 0) {
        const calcAmount = this.betAmountStore.betAmount + amount;
        const validatedAmount = calcAmount > this.gameConfig.maxBet ? this.gameConfig.maxBet : calcAmount;
        this.betAmountStore.betAmount = validatedAmount;
    }

    quickChangeBetAmount(isIncrease: boolean) {
        const chips = this.gameConfig.chips;
        let index = chips.findIndex((chip) => +chip === this.betAmountStore.betAmount);
        index += isIncrease ? 1 : -1;
        if (index < 0 || index > chips.length - 1) {
            return;
        }

        this.betAmountStore.betAmount = +this.gameConfig.chips[index];
    }
}
