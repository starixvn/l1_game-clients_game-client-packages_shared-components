import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
const { Shared } = gc;
const { injectable, inject } = inversify;

@injectable()
export class VolumeStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private readonly STORAGE_KEY_SFX_VOLUME = "SFXVolume";
    private readonly STORAGE_KEY_BGM_VOLUME = "BGMVolume";

    private _SFXVolume: number = 0;
    public get SFXVolume(): number {
        return this._SFXVolume;
    }

    public set SFXVolume(value: number) {
        Shared.utils.StorageManager.set(this.STORAGE_KEY_SFX_VOLUME, value.toString());
        this._SFXVolume = value;
    }

    private _BGMVolume: number = 0;
    public get BGMVolume(): number {
        return this._BGMVolume;
    }

    public set BGMVolume(value: number) {
        Shared.utils.StorageManager.set(this.STORAGE_KEY_BGM_VOLUME, value.toString());
        this._BGMVolume = value;
    }

    onLoadStorage() {
        if (!Shared.utils.StorageManager.get(this.STORAGE_KEY_SFX_VOLUME)) {
            Shared.utils.StorageManager.set(this.STORAGE_KEY_SFX_VOLUME, "1");
        }
        if (!Shared.utils.StorageManager.get(this.STORAGE_KEY_BGM_VOLUME)) {
            Shared.utils.StorageManager.set(this.STORAGE_KEY_BGM_VOLUME, "1");
        }
        this.SFXVolume = +Shared.utils.StorageManager.get(this.STORAGE_KEY_SFX_VOLUME);
        this.BGMVolume = +Shared.utils.StorageManager.get(this.STORAGE_KEY_BGM_VOLUME);
    }
}
