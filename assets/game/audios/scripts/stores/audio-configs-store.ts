import inversify from "inversify";
import mobx from "mobx";
import { TAudioValue } from "../component/audio-container";

const { injectable } = inversify;

export type TAudioConfigs = {
    [key: string]: TAudioValue;
};

@injectable()
export class AudioConfigsStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _audioConfigs: TAudioConfigs = {};

    set audioConfigs(audioConfigs: TAudioConfigs) {
        this._audioConfigs = audioConfigs;
    }

    get audioConfigs() {
        return this._audioConfigs;
    }
}
