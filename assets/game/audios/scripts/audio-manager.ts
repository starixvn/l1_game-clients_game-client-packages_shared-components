import { siteConfigs } from "db://assets/scripts/site-configs";
import { IRemoteThemeSoundConfigs, TAudioConfigs } from "./component/audio-container";
import gc from "@sg/game-client-base";
import { FunctionUtils } from "db://shared-components/shared/utils";
import { JsonAsset, log } from "cc";

export type IRemoteGameSoundConfigs = {
    version: number;
    sounds: TAudioConfigs;
};

export default class AudioManager {
    public static getInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }

        return this.instance;
    }

    private static instance: AudioManager;
    audioConfigs: TAudioConfigs = {};
    remoteThemeSoundConfigs: IRemoteThemeSoundConfigs = null;
    remoteThemeAudioConfigs: TAudioConfigs = null;
    remoteGameAudioConfigs: IRemoteGameSoundConfigs = null;
    defaultLang = "en";
    remoteGameName = "";

    get remoteGameConfigUrl() {
        return `${this.getRemoteGameBasePath()}/${this.remoteGameName}/info.json?v=${Date.now()}`;
    }

    setAudioConfigs(configs?: TAudioConfigs) {
        if (configs) {
            this.removeEmptyKey(configs);
            this.audioConfigs = configs;
        }

        return this.audioConfigs;
    }

    private removeEmptyKey(configs: TAudioConfigs) {
        const emptyValueKeys = Object.keys(configs).filter((key) => Object.keys(configs[key]).length === 0);
        emptyValueKeys.forEach((key) => delete configs[key]);
    }

    getAudioInfo(key: string, lang?: string) {
        const configs = audioManager.audioConfigs;
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

    getAudioPath(key: string, lang?: string) {
        const info = this.getAudioInfo(key, lang);
        return info?.path || null;
    }

    getRemoteThemeBasePath() {
        return `${gc.UrlUtils.buildShareResource(siteConfigs)}/sounds/themes`;
    }

    getRemoteGameBasePath() {
        return `${gc.UrlUtils.buildShareResource(siteConfigs)}/sounds/games`;
    }

    async getRemoteThemeConfigs() {
        try {
            const configUrl = `${this.getRemoteThemeBasePath()}/info.json?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            audioManager.remoteThemeSoundConfigs = (jsonAsset?.json as IRemoteThemeSoundConfigs) ?? null;
        } catch (error) {
            log("Get config remote sounds failed!");
        }
    }

    async getRemoteAudioThemeConfig() {
        try {
            const configUrl = `${this.getRemoteThemeBasePath()}/${
                audioManager.remoteThemeSoundConfigs.defaultTheme
            }/info.json?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            audioManager.remoteThemeAudioConfigs = (jsonAsset?.json as TAudioConfigs) ?? null;
        } catch (error) {
            log("Get remote audio config failed!");
        }
    }

    async getRemoteGameConfigs(remoteGameName: string) {
        try {
            this.remoteGameName = remoteGameName;
            const jsonAsset = (await FunctionUtils.loadRemote(this.remoteGameConfigUrl)) as JsonAsset;
            audioManager.remoteGameAudioConfigs = (jsonAsset?.json as IRemoteGameSoundConfigs) ?? null;
        } catch (error) {
            log("Get config remote sounds failed!");
        }
    }

    get themePath() {
        return `${this.getRemoteThemeBasePath()}/${this.remoteThemeSoundConfigs.defaultTheme}`;
    }
}

export const audioManager = AudioManager.getInstance();
