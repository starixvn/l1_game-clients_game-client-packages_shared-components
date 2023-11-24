import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetInputStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;
    @inject(gc.GameCrash.CrashCashOut.CrashCashoutStore) private readonly cashoutStore: gc.GameCrash.CrashCashOut.CrashCashoutStore;

    private _betAmount = -1;
    isOpenBetAmountPopup = false;
    betAmountTemp = 0;
    isDisabledBetInput = false;

    get betAmount(): number {
        return this._betAmount > -1 ? this._betAmount : this.roundStore.minBet;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    get descreaseStatus(): boolean {
        return this.betAmount > this.roundStore.minBet;
    }

    get increaseStatus(): boolean {
        return this.betAmount < this.roundStore.maxBet;
    }

    get betAmountRatio(): number {
        return this.betAmount * this.cashoutStore.ratio;
    }

    get minBet(): number {
        return this.roundStore.minBet;
    }

    get maxBet(): number {
        return this.roundStore.maxBet;
    }

    get chips(): string[] {
        const convertedChips = [];
        this.gameConfig.chips.forEach((chip) => {
            convertedChips.push(gc.FormatUtils.nFormatter(+chip));
        });
        return convertedChips;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
