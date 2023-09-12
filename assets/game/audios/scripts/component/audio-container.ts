import { AudioClip, AudioSource, JsonAsset, _decorator, game, log, sys } from "cc";
import { bundleManager } from "../../../../shared/common-components/bundle-magager/bundle-manager";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { Audios, UserSettings, App, BrowserDomUtils } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export type TAudioConfigs = {
    [key: string]: TAudioValue;
};
export type TAudioValue = {
    bundle: string;
    path: string;
    type: string;
};

enum ECurrentPlayTime {
    playMusic = "playMusic",
    playSFX = "playSFX",
}

@ccclass
export class AudioContainer extends ObserverComponent {
    @property(JsonAsset)
    sharedAudioConfig: JsonAsset = null;

    @property(JsonAsset)
    audioConfig: JsonAsset = null;

    @property(AudioSource)
    musicSource: AudioSource = null;

    @property(AudioSource)
    sfxSource: AudioSource = null;

    audios = [];
    musicIds = [];
    protected audioConfigs: TAudioConfigs = {};
    protected isUserGesture = false;
    protected isPlayMusic = false;
    protected isPlaySFX = false;
    protected currentPlayTime = {
        [ECurrentPlayTime.playMusic]: 0,
        [ECurrentPlayTime.playSFX]: 0,
    };

    onLoad() {
        super.onLoad();
        this.loadAudios().catch((error) => log(error));
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));

        // The AudioContext was not allowed to start.
        // It must be resumed (or created) after a user gesture on the page
        this.initTouchBind();
    }

    protected initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = () => {
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);
    }

    protected postMessageUserGestureToParent() {
        BrowserDomUtils.postMessageToParent({ isUserGesture: true });
    }

    @render(App.AppStore, (store) => store.isUserGesture)
    setUserGesture(isUserGesture: boolean): void {
        if (sys.os !== sys.OS.IOS && isUserGesture) {
            this.isUserGesture = true;
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, state: gc.Audios.MusicState) => handle.updateMusicState(state))
    updateMusicState(state: gc.Audios.MusicState) {
        return state;
    }

    @handle(gc.Audios.AudioHandler, (handle, ids: string[]) => handle.setMusicIds(ids))
    registerMusicIds() {
        return this.musicIds;
    }

    async loadAudios() {
        const audioConfigs: TAudioConfigs = {
            ...this.sharedAudioConfig?.json,
            ...this.audioConfig?.json,
        };
        this.audioConfigs = audioConfigs;
        const keys = Object.keys(audioConfigs);
        for (const key of keys) {
            const value = audioConfigs[key];
            if (value.type === "music") {
                this.musicIds.push(key);
            } else {
                this.audios.push(key);
            }
        }

        this.registerMusicIds();
        this.audiosLoaded();
    }

    async loadAssets(audioValue: TAudioValue, key: string, currentLoadAssetTime: number, isPlay: boolean) {
        const bundle = audioValue.bundle;
        const path = `audios/${audioValue.path ?? key}`;
        const audioClip = ((await bundleManager.loadAssetsFromBundle(bundle, path, AudioClip, null)) as AudioClip) || null;

        return { audioClip, currentLoadAssetTime, isPlay };
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        this.isPlayMusic = musicEnable;
        if (!musicEnable) {
            this.stopMusic();
        }
    }

    @render(UserSettings.UserSettingStore, (store) => store.sfxEnable, { fireImmediately: false })
    enableSFX(sfxEnable: boolean) {
        this.isPlaySFX = sfxEnable;
    }

    @render(Audios.AudioStore, (store) => store.music, { fireImmediately: false })
    playMusic(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY) {
            this.playMusicAudio(data.id);
        }
    }

    async playMusicAudio(id: string) {
        await this.playAudio(
            id,
            (clip, isPlay) => {
                isPlay === this.isPlayMusic && this.playAudioClip(clip);
            },
            ECurrentPlayTime.playMusic,
            this.isPlayMusic
        );
    }

    protected playAudioClip(audioClip: AudioClip) {
        this.musicSource.clip = audioClip;
        this.musicSource.play();
    }

    protected stopMusic() {
        this.musicSource.stop();
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFX(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id);
        }
    }

    async playSFXAudio(id: string) {
        this.playAudio(
            id,
            (clip, isPlay) => {
                isPlay === this.isPlaySFX && this.sfxSource.playOneShot(clip);
            },
            ECurrentPlayTime.playSFX,
            this.isPlaySFX
        );
    }

    async playAudio(
        id: string,
        playFunction: (clip: AudioClip, isPlay: boolean) => void,
        currentTimeField: string,
        isCurrentPlaying: boolean
    ) {
        const audioValue = this.audioConfigs?.[id];
        if (!audioValue) {
            return;
        }

        const currentTime = new Date().getTime();
        this.currentPlayTime[currentTimeField] = currentTime;
        const { audioClip, currentLoadAssetTime, isPlay } = await this.loadAssets(audioValue, id, currentTime, isCurrentPlaying);

        if (audioClip) {
            if (this.currentPlayTime[currentTimeField] !== currentLoadAssetTime) {
                return;
            }

            playFunction(audioClip, isPlay);
        }
    }
}
