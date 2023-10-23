import inversify from "inversify";
import AutoCashOutPopupStore from "../stores/auto-cash-out-popup-store";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutPopupHandler {
    @inject(AutoCashOutPopupStore) private readonly autoCashoutPopupStore: AutoCashOutPopupStore;

    togglePopup(enable: boolean) {
        this.autoCashoutPopupStore.enable = enable;
    }

    handleMultiplier(multiplier: number) {
        this.autoCashoutPopupStore.multiplier = multiplier;
        this.autoCashoutPopupStore.isValid = multiplier >= 1.01 && multiplier <= 2000;
    }
}
