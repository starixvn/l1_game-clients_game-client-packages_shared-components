import inversify from "inversify";

import { VolumeStore } from "./volume-store";

const { injectable, inject } = inversify;

@injectable()
export class VolumeHandlers {
    @inject(VolumeStore) private readonly VolumeStore: VolumeStore;

    handleSFX(value: number) {
        this.VolumeStore.SFXVolume = value;
    }

    handleBGM(value: number) {
        this.VolumeStore.BGMVolume = value;
    }

    onLoadStorage() {
        this.VolumeStore.onLoadStorage();
    }
}
