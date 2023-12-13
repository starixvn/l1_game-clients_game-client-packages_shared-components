import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetInputStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;
    @inject(gc.GameCrash.CrashCashOut.CrashCashOutStore) private readonly cashOutStore: gc.GameCrash.CrashCashOut.CrashCashOutStore;

    private _betAmount = -1;
    isOpenBetAmountPopup = false;
    betAmountTemp = 0;
    isDisabledBetInput = false;

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    get decreaseStatus(): boolean {
        return this.betAmount > this.roundStore.minBet;
    }

    get increaseStatus(): boolean {
        return this.betAmount < this.roundStore.maxBet;
    }

    get betAmountRatio(): number {
        return this.betAmount * this.cashOutStore.ratio;
    }

    get minBet(): number {
        return this.roundStore.minBet;
    }

    get maxBet(): number {
        return this.roundStore.maxBet;
    }

    get chips(): string[] {
        return this.gameConfig.chips;
    }

    updateBetAmountFromOwnBets() {
        this.betAmount = this.roundStore.ownBets.amount;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
