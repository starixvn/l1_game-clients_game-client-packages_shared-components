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
            this.removeEmptyKey(configs);
            instance.audioConfigs = configs;
        }
        return instance.audioConfigs;
    }

    private static removeEmptyKey(configs: TAudioConfigs) {
        const emptyValueKeys = Object.keys(configs).filter((key) => Object.keys(configs[key]).length === 0);
        emptyValueKeys.forEach((key) => delete configs[key]);
    }

    static getAudioInfo(key: string, lang?: string) {
        const configs = this.audioConfigs();
        const config = configs[key];

        if (!config) {
            return null;
        }

        if (!config.supportedLanguages || !lang) {
            return config;
        }

        const isSupported = config.supportedLanguages.includes(lang);
        const targetLang = isSupported ? lang : "en";

        // Replace {lang} in path with actual language
        const path = config.path.replace("{lang}", targetLang);

        return {
            bundle: config.bundle,
            path: path,
            type: config.type,
        };
    }

    static getAudioPath(key: string, lang?: string) {
        const info = this.getAudioInfo(key, lang);
        return info?.path || null;
    }
}
