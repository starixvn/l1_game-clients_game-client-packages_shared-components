import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { IGameCrashUserSettings } from "../../../scripts/components/game-crash-data";

const { injectable, inject } = inversify;
@injectable()
export default class AutoCashOutStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;

    constructor() {
        mobx.makeAutoObservable(this);
        this.loadMultiplierFromStorage();

        mobx.when(
            () => !!this.roundStore && !!this.roundStore.ownBets,
            () => {
                this.setMultiplierFromOwnBets(this.roundStore.ownBets as gc.GameCrash.GameCrashServiceMessage.CrashOwnBets);
            }
        );
    }

    private _enable = false;
    private _multiplier = 1.01;

    private _disable = false;

    private loadMultiplierFromStorage() {
        const userSetting = gc.Shared.utils.StorageManager.get(gc.Shared.utils.localStorageKeys.userSetting) as IGameCrashUserSettings;
        if (userSetting) {
            userSetting.autoCashOutMultiplier && (this.multiplier = userSetting.autoCashOutMultiplier);
            userSetting.enableAutoCashOut && (this.enable = userSetting.enableAutoCashOut);
        }
    }

    private setMultiplierFromOwnBets(ownBets: gc.GameCrash.GameCrashServiceMessage.CrashOwnBets) {
        if (ownBets && ownBets.autoCashOut >= 0) {
            this.enable = false;
            const autoCashOut = +ownBets.autoCashOut;
            if (autoCashOut > 0) {
                this.multiplier = autoCashOut;
                this.enable = true;
            }
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
