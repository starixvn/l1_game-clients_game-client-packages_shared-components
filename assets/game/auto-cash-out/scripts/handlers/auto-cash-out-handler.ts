import inversify from "inversify";
import AutoCashOutStore from "../stores/auto-cash-out-store";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutHandler {
    @inject(AutoCashOutStore) private readonly autoCashoutStore: AutoCashOutStore;

    handleEnable(enable: boolean) {
        this.autoCashoutStore.enable = enable;
    }

    handleMultiplier(multiplier: number) {
        this.autoCashoutStore.multiplier = multiplier;
    }

    adjustMultiplier(value: number) {
        this.autoCashoutStore.multiplier = parseFloat((this.autoCashoutStore.multiplier + value).toFixed(2));
    }
}
