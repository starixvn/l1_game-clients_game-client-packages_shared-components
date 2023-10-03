import { AudioClip } from "cc";
import { bundleManager } from "../../../shared/common-components/bundle-magager/bundle-manager";
import { AudioContainer, TAudioValue } from "../scripts/component/audio-container";

interface AudioInfo {
    bundle: string;
    path: string;
}

export let audioContainer: AudioContainer = null; //NOSONAR

export const getAudioInfo = (audioValue: TAudioValue, key: string): AudioInfo => {
    const bundle = audioValue.bundle;
    const path = `audios/${audioValue.path ?? key}`;
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

export const getDurationClip = async (soundId: string, maxWaitingTime = 1000): Promise<number> => {
    let duration = 0;
    let isCancel = false;

    const cancelTimeout = () => {
        isCancel = true;
    };

    const timeoutCancel = setTimeout(cancelTimeout, maxWaitingTime);

    const audioValue = audioContainer?.audioConfigs?.[soundId];
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
