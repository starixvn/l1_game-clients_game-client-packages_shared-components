import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export default class AutoCashOutStore {
    private enable: boolean = false;
    private multiplier: number = 0;

    constructor() {
        makeAutoObservable(this);
    }
    get isEnable(): boolean {
        return this.enable;
    }

    set setEnable(trigger: boolean) {
        this.enable = trigger;
    }

    get getMultiplier(): number {
        return this.multiplier;
    }

    set setMultiplier(multiplier: number) {
        this.multiplier = multiplier;
    }
}
