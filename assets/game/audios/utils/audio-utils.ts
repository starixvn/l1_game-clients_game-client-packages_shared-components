import { AudioClip } from "cc";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { audioManager } from "../scripts/audio-manager";
import { TAudioValue } from "../scripts/component/audio-container";
import gc from "@sg/game-client-base";

interface AudioInfo {
    bundle: string;
    path: string;
}

export const getAudioInfo = (audioValue: TAudioValue, key: string): AudioInfo => {
    const bundle = audioValue.bundle;
    let path = `audios/${audioValue.path ?? key}`;
    const currentLang = gc.Translator.getLanguageId();

    if (audioValue.supportedLanguages?.length && currentLang) {
        const langPath = audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? "en";
        path = `audios/${langPath}/${audioValue.path ?? key}`;
    }

    return { bundle, path };
};

export const getRemoteAudioInfo = (audioValue: TAudioValue, key: string): AudioInfo => {
    if (audioValue.gameId > 0) {
    } else {
    }

    const bundle = audioValue.bundle;
    let path = `audios/${audioValue.path ?? key}`;
    const currentLang = gc.Translator.getLanguageId();

    if (audioValue.supportedLanguages?.length && currentLang) {
        const langPath = audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? "en";
        path = `audios/${langPath}/${audioValue.path ?? key}`;
    }

    return { bundle, path };
};

export const getAudioClip = async (bundle: string, path: string): Promise<AudioClip | null> => {
    try {
        const loadedClip = await bundleManager.loadAssetsFromBundle(bundle, path, AudioClip, null);
        return loadedClip as AudioClip;
    } catch (error) {
        console.error(`Failed to load audio clip from bundle: ${error}`);
        return null;
    }
};

export const getRemoteAudioClip = async (url: string): Promise<AudioClip | null> => {
    try {
        const loadedClip = await bundleManager.getRemoteAsset<AudioClip>(url);
        return loadedClip as AudioClip;
    } catch (error) {
        console.error(`Failed to load audio clip from bundle: ${error}`);
        return null;
    }
};

export const getGameAudioUrl = (audioValue: TAudioValue, soundId: string): string => {
    const currentLang = gc.Translator.getLanguageId();
    const { path } = audioManager.remoteThemeAudioConfigs[soundId];
    const version = audioManager.remoteThemeSoundConfigs?.sounds?.version ?? Date.now();

    const langPath =
        audioValue.supportedLanguages?.length && currentLang
            ? audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? audioManager.defaultLang
            : undefined;

    return `${audioManager.gamePath}${langPath ? `/${langPath}` : ""}/${path}.mp3?v=${version}`;
};

export const getRemoteThemeAudioUrl = (audioValue: TAudioValue, soundId: string): string => {
    const currentLang = gc.Translator.getLanguageId();
    const { version } = audioManager.remoteThemeSoundConfigs;
    const soundPath = audioManager.remoteThemeAudioConfigs[soundId].path;

    const langPath =
        audioValue.supportedLanguages?.length && currentLang
            ? audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? audioManager.defaultLang
            : null;

    return langPath
        ? `${audioManager.themePath}/${langPath}/${soundPath}.mp3?v=${version}`
        : `${audioManager.themePath}/${soundPath}.mp3?v=${version}`;
};

export const getDurationClip = async (soundId: string, maxWaitingTime = 1000): Promise<number> => {
    let duration = 0;
    let isCancel = false;

    const cancelTimeout = () => {
        isCancel = true;
    };

    const timeoutCancel = setTimeout(cancelTimeout, maxWaitingTime);
    const audioValue = audioManager?.audioConfigs?.[soundId];
    if (!audioValue) {
        return duration;
    }

    const { bundle, path } = getAudioInfo(audioValue, soundId);
    if (!bundle || !path) {
        return duration;
    }

    const audioClip = await getAudioClip(bundle, path);
    if (!audioClip || isCancel) {
        return duration;
    }

    duration = audioClip.getDuration();

    clearTimeout(timeoutCancel);

    return duration;
};
