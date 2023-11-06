import gc from "@sg/game-client-base";
import inversify from "inversify";
import AutoCashOutPopupStore from "../stores/auto-cash-out-popup-store";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutPopupHandler {
    @inject(AutoCashOutPopupStore) private readonly autoCashoutPopupStore: AutoCashOutPopupStore;
    @inject(gc.GameCrash.CrashGameConfigs.CrashGameConfigStore) private readonly gameConfigStore: gc.GameCrash.CrashGameConfigs.CrashGameConfigStore;

    togglePopup(enable: boolean) {
        this.autoCashoutPopupStore.enable = enable;
    }

    handleMultiplier(multiplierString: string) {
        this.autoCashoutPopupStore.multiplier = multiplierString;

        const multiplier = parseFloat(multiplierString);
        this.autoCashoutPopupStore.isValid = multiplier >= 1.01 && multiplier <= this.gameConfigStore.maxMultiplier;
    }
}
