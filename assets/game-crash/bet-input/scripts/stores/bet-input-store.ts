import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { IGameCrashUserSettings } from "../../../scripts/components/game-crash-data";

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

    constructor() {
        mobx.makeAutoObservable(this);
        this.handleBetAmountFromStorageAndOwnBets();
    }

    private handleBetAmountFromStorageAndOwnBets() {
        this.loadBetAmountFromStorage();
        mobx.when(
            () => this.roundStore && Object.keys(this.roundStore.ownBets).length > 0,
            () => {
                this.setBetAmountFromOwnBets(this.roundStore.ownBets as gc.GameCrash.GameCrashServiceMessage.CrashOwnBets);
            }
        );
    }

    private setBetAmountFromOwnBets(ownBets: gc.GameCrash.GameCrashServiceMessage.CrashOwnBets) {
        if (ownBets && ownBets.amount > 0) {
            this.betAmount = +ownBets.amount;
        }
    }

    private loadBetAmountFromStorage() {
        const userSetting = gc.Shared.utils.StorageManager.get(gc.Shared.utils.localStorageKeys.userSetting) as IGameCrashUserSettings;
        userSetting?.betAmount && (this.betAmount = userSetting.betAmount);
    }

    get betAmount(): number {
        return this._betAmount;
    }

    set betAmount(amount: number) {
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
