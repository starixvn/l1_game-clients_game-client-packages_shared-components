import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutStore {
    private _enable: boolean = false;
    private _multiplier: number = 1.01;

    private _disable: boolean = false;

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
        this._multiplier = multiplier;
    }

    get disable(): boolean {
        return this._disable;
    }

    set disable(trigger: boolean) {
        this._disable = trigger;
    }
}
