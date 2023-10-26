import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;
@injectable()
export default class AutoCashOutPopupStore {
    private _enable: boolean = false;
    private _isValid: boolean = false;
    private _multiplier: number = 1.01;

    constructor() {
        mobx.makeAutoObservable(this);
    }
    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }

    get isValid(): boolean {
        return this._isValid;
    }

    set isValid(isValid: boolean) {
        this._isValid = isValid;
    }

    get multiplier(): number {
        return this._multiplier;
    }

    set multiplier(multiplier: number) {
        this._multiplier = multiplier;
    }
}
