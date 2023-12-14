import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;

    constructor() {
        mobx.makeAutoObservable(this);
        this.loadMultiplierFromStorage();
        mobx.when(
            () => !!this.roundStore?.ownBets,
            () => {
                this.setMultiplierFromOwnBets(this.roundStore.ownBets);
            }
        );
    }

    private _enable = false;
    private _multiplier = 1.01;

    private _disable = false;
    private readonly autoCashOutKey = "auto_cash_out";

    private loadMultiplierFromStorage() {
        const multiplierFromStorage = +gc.Shared.utils.StorageManager.get(this.autoCashOutKey);
        multiplierFromStorage > 0 && (this.multiplier = multiplierFromStorage);
    }

    private setMultiplierFromOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        if (ownBets && ownBets.autoCashOut > 0) {
            this.multiplier = +ownBets.autoCashOut;
        }
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(trigger: boolean) {
        this._enable = trigger;
    }

    get multiplier(): number {
        return this._multiplier;
    }

    set multiplier(multiplier: number) {
        this._multiplier = multiplier;
    }

    get disable(): boolean {
        return this._disable;
    }

    set disable(trigger: boolean) {
        this._disable = trigger;
    }
}
