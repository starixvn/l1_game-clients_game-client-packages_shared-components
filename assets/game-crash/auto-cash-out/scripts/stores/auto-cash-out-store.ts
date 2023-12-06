import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;

    private _enable = false;
    private _multiplier = 1.01;

    private _disable = false;

    constructor() {
        mobx.makeAutoObservable(this);
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
        this._multiplier = this.roundStore.ownBets.autoCashOut ?? multiplier;
    }

    get disable(): boolean {
        return this._disable;
    }

    set disable(trigger: boolean) {
        this._disable = trigger;
    }

    private updateMultiplierFromOwnBets() {
        this.multiplier = this.roundStore.ownBets.autoCashOut;
    }
}
