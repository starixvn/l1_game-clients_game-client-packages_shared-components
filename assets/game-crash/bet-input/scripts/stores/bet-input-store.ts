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
    private readonly betAmountKey = "bet_amount";
    isOpenBetAmountPopup = false;
    betAmountTemp = 0;
    isDisabledBetInput = false;

    constructor() {
        mobx.makeAutoObservable(this);
        this.handleBetAmountFromStorageAndOwnBets();
    }

    private handleBetAmountFromStorageAndOwnBets() {
        this.loadBetAmountFromStorage();
        mobx.reaction(
            () => this.roundStore?.ownBets,
            (ownBets) => {
                this.setBetAmountFromOwnBets(ownBets);
            }
        );
    }

    private setBetAmountFromOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        if (ownBets && ownBets.amount > 0) {
            this.betAmount = +ownBets.amount;
        }
    }

    private loadBetAmountFromStorage() {
        const betAmountFromStorage = +gc.Shared.utils.StorageManager.get(this.betAmountKey);
        betAmountFromStorage > 0 && (this.betAmount = betAmountFromStorage);
    }

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
        gc.Shared.utils.StorageManager.set(this.betAmountKey, amount.toString());
        this._betAmount = amount;
    }

    get decreaseStatus(): boolean {
        return this.betAmount > this.minBet;
    }

    get increaseStatus(): boolean {
        return this.betAmount < this.maxBet;
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

    get betAmountGreaterMinBet() {
        return this.minBet <= this.betAmount;
    }
}
