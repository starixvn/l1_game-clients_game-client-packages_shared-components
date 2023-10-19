import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;
@injectable()
export default class AutoCashOutStore {
    private _enable: boolean = false;
    private _multiplier: number = 1.01;

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
}
