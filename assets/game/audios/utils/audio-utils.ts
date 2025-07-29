import gc from "@sg/game-client-base";
import { AudioClip, find } from "cc";
import { AudioObserver } from "db://shared-components/shared/common-components/audio-observer";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { audioManager } from "../scripts/audio-manager";
import { TAudioValue } from "../scripts/component/audio-container";

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

export const getAudioClip = (bundle: string, path: string): Promise<AudioClip | null> => {
    return bundleManager.loadAssetsFromBundle<AudioClip>(bundle, path, AudioClip, null);
};

export const getRemoteAudioClip = (url: string): Promise<AudioClip | null> => {
    return bundleManager.getRemoteAsset<AudioClip>(url);
};

export const getGameAudioUrl = (audioValue: TAudioValue, soundId: string): string => {
    const currentLang = gc.Translator.getLanguageId();
    const { sounds, version } = audioManager.remoteGameAudioConfigs;
    const { path } = sounds?.[soundId];

    const langPath =
        audioValue.supportedLanguages?.length && currentLang
            ? audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? audioManager.defaultLang
            : undefined;

    return `${audioManager.getRemoteGameBasePath()}/${audioManager.remoteGamePath}/${
        langPath ? `${langPath}/` : ""
    }${path}.mp3?v=${version}`;
};

export const getRemoteThemeAudioUrl = (audioValue: TAudioValue, soundId: string): string => {
    const currentLang = gc.Translator.getLanguageId();
    const { version } = audioManager.remoteThemeSoundConfigs;
    const soundPath = audioManager.remoteThemeAudioConfigs[soundId].path;

    const langPath =
        audioValue.supportedLanguages?.length && currentLang
            ? audioValue.supportedLanguages.find((lang) => lang === currentLang) ?? audioManager.defaultLang
            : null;

    const themePath = `${audioManager.themePath}`;
    return langPath ? `${themePath}/${langPath}/${soundPath}.mp3?v=${version}` : `${themePath}/${soundPath}.mp3?v=${version}`;
};

export const getDurationClip = async (soundId: string, maxWaitingTime = 1000): Promise<number> => {
    let duration = 0;
    let isCancelled = false;

    const timeoutId = setTimeout(() => {
        isCancelled = true;
    }, maxWaitingTime);

    try {
        const audioValue = getAudioValue(soundId);
        if (!audioValue) {
            return duration;
        }

        const audioClip = await loadAudioClip(soundId, audioValue);
        if (audioClip && !isCancelled) {
            duration = audioClip.getDuration();
        }
    } catch (error) {
        console.error(`Failed to get duration for sound ${soundId}:`, error);
    } finally {
        clearTimeout(timeoutId);
    }

    return duration;
};

const getAudioValue = (soundId: string) => {
    return audioManager.audioConfigs?.[soundId];
};

const loadAudioClip = async (soundId: string, audioValue: any): Promise<AudioClip | null> => {
    if (audioValue?.isRemote) {
        let url = "";
        if (audioValue?.remoteType === "game") {
            url = getGameAudioUrl(audioValue, soundId);
        } else {
            url = getRemoteThemeAudioUrl(audioValue, soundId);
        }

        return getRemoteAudioClip(url);
    }

    const { bundle, path } = getAudioInfo(audioValue, soundId);
    if (bundle && path) {
        return getAudioClip(bundle, path);
    }

    return null;
};

export const getAudioObserver = () => {
    const audioObserver = find("Canvas").getComponentsInChildren(AudioObserver);
    return audioObserver[0];
};

export const playClick = () => {
    const audioObserver = getAudioObserver();
    audioObserver?.playClick();
};

export const playSFX = (soundId: string) => {
    const audioObserver = getAudioObserver();
    audioObserver?.playSFX(soundId);
};

export const playStoppableSFX = (soundId: string, loop: boolean) => {
    const audioObserver = getAudioObserver();
    audioObserver?.playStoppableSFX(soundId, loop);
};

export const stopStoppableSFX = (soundId: string) => {
    const audioObserver = getAudioObserver();
    audioObserver?.stopStoppableSFX(soundId);
};
