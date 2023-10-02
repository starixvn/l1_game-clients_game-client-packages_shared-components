import { AudioClip } from "cc";
import { bundleManager } from "../../../shared/common-components/bundle-magager/bundle-manager";
import { TAudioValue } from "../scripts/component/audio-container";
import { TAudioConfigs } from "../scripts/stores/audio-configs-store";

interface AudioInfo {
    bundle: string;
    path: string;
}

export namespace AudioUtils {
    export const loadAssets = async (
        audioValue: TAudioValue,
        soundId: string,
        currentLoadAssetTime: number,
        isPlay: boolean
    ): Promise<{ audioClip: AudioClip | null; currentLoadAssetTime: number; isPlay: boolean }> => {
        const { bundle, path } = getAudioInfo(audioValue, soundId);

        if (!bundle || !path) {
            return { audioClip: null, currentLoadAssetTime: 0, isPlay: false };
        }

        const audioClip = await getAudioClip(bundle, path);

        return { audioClip, currentLoadAssetTime, isPlay };
    };

    const getAudioInfo = (audioValue: TAudioValue, key: string): AudioInfo => {
        const bundle = audioValue.bundle;
        const path = `audios/${audioValue.path ?? key}`;
        return { bundle, path };
    };

    const getAudioClip = async (bundle: string, path: string): Promise<AudioClip | null> => {
        try {
            const loadedClip = await bundleManager.loadAssetsFromBundle(bundle, path, AudioClip, null);
            return loadedClip as AudioClip;
        } catch (error) {
            console.error(`Failed to load audio clip from bundle: ${error}`);
            return null;
        }
    };

    export const getDurationClip = async (audioConfigs: TAudioConfigs, soundId: string, maxWaitingTime = 1000): Promise<number> => {
        let duration = 0;
        let isCancel = false;

        const cancelTimeout = () => {
            isCancel = true;
        };

        const timeoutCancel = setTimeout(cancelTimeout, maxWaitingTime);
        if (!audioConfigs) {
            return duration;
        }

        const audioValue = audioConfigs?.[soundId];

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
}
