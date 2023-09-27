import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class BetAmountStore {
    _betAmount = -1;

    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    get betAmount(): number {
        return this.betAmount > -1 ? this.betAmount : this.gameConfig.minBet;
    }

    set betAmount(amount: number) {
        this._betAmount = amount;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
