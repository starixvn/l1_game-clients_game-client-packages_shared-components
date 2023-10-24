import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetInputStore {
    @inject(gc.CrashGameConfigStore) private readonly gameConfig: gc.CrashGameConfigStore;
    @inject(gc.CrashCashOut.CrashCashoutStore) private readonly cashoutStore: gc.CrashCashOut.CrashCashoutStore;

    private _betAmount = -1;
    isOpenBetAmountPopup = false;
    betAmountTemp = 0;
    isDisabledBetInput = false;

    get betAmount(): number {
        return this._betAmount > -1 ? this._betAmount : this.gameConfig.minBet;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    get descreaseStatus(): boolean {
        return this.betAmount > this.gameConfig.minBet;
    }

    get increaseStatus(): boolean {
        return this.betAmount < this.gameConfig.maxBet;
    }

    get betAmountRatio(): number {
        return this.betAmount * this.cashoutStore.ratio;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
