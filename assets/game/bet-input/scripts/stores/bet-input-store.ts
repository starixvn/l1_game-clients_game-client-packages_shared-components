import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

interface IBetInputButtonStatus {
    descreaseStatus: boolean;
    increaseStatus: boolean;
}

@injectable()
export class BetInputStore {
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    private _betAmount = -1;
    get betAmount(): number {
        return this._betAmount > -1 ? this._betAmount : this.gameConfig.minBet;
    }
    set betAmount(amount: number) {
        this._betAmount = amount;
    }
    public betAmountTemp = 0;
    public descreaseStatus = false;
    public increaseStatus = true;
    public isOpenBetAmountPopup = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get betInputButtonStatus(): IBetInputButtonStatus {
        return { descreaseStatus: this.descreaseStatus, increaseStatus: this.increaseStatus };
    }
}
