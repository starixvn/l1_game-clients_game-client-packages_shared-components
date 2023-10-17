import { inject, injectable } from "inversify";
import AutoCashOutStore from "../stores/auto-cash-out-store";

@injectable()
export default class AutoCashOutHandler {
    constructor(@inject(AutoCashOutStore) protected readonly autoCashoutStore: AutoCashOutStore) {}
    handle(enable: boolean, multiplier: number) {
        this.autoCashoutStore.setEnable = enable;
        this.autoCashoutStore.setMultiplier = multiplier;
    }
}
