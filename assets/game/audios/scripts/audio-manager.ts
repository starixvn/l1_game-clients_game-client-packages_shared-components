import { TAudioConfigs } from "./component/audio-container";

export default class AudioManager {
    public static getInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }

        return this.instance;
    }

    private static instance: AudioManager;
    audioConfigs: TAudioConfigs = {};

    static audioConfigs(configs?: TAudioConfigs) {
        const instance = AudioManager.getInstance();
        if (configs) {
            instance.audioConfigs = configs;
        }
        return instance.audioConfigs;
    }
}
