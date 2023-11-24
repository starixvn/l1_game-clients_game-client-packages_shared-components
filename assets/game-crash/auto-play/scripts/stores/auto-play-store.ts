import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class AutoPlayStore {
    public roundsList = [10, 30, 50, 80, 100, 200, 500, 1000];
    public isOpenAutoPlayPopup = false;
    public selectedRoundOnPopup = this.roundsList[0];
    public roundsAutoPlay = 0;

    public isAutoPlay = false;
    private _hasEarlyBetBeforeAutoPlay = false;
    private _autoPlayWhenPlacingBet = false;

    set hasEarlyBetBeforeAutoPlay(value: boolean) {
        this._hasEarlyBetBeforeAutoPlay = value;
    }

    get hasEarlyBetBeforeAutoPlay(): boolean {
        return this._hasEarlyBetBeforeAutoPlay;
    }

    set autoPlayWhenPlacingBet(value: boolean) {
        this._autoPlayWhenPlacingBet = value;
    }

    get autoPlayWhenPlacingBet(): boolean {
        return this._autoPlayWhenPlacingBet;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
