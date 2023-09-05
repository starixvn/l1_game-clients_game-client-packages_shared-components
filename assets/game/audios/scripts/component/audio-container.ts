import { AudioClip, AudioSource, JsonAsset, _decorator, game, log } from "cc";
import { bundleManager } from "../../../../shared/common-components/bundle-magager/bundle-manager";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { Audios, UserSettings } = gc;
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
    protected isGesture = false;

    onLoad() {
        super.onLoad();

        this.loadAudios().catch((error) => log(error));
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));

        // The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page
        this.initTouchBind();
    }

    initTouchBind() {
        const touchend = "ontouchend" in window ? "touchend" : "mouseup";
        const touchStart = "ontouchstart" in window ? "touchstart" : "mousedown";
        game.canvas.addEventListener(touchStart, () => {
            this.isGesture = true;
        });

        game.canvas.addEventListener(touchend, () => {
            this.isGesture = true;
        });
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

    async loadAssets(audioValue: TAudioValue, key: string) {
        const bundle = audioValue.bundle;
        const path = `audios/${audioValue.path ?? key}`;
        const audioClip = ((await bundleManager.loadAssetsFromBundle(bundle, path, AudioClip, null)) as AudioClip) || null;

        return audioClip;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        if (!musicEnable) {
            this.musicSource.stop();
        }
    }

    @render(Audios.AudioStore, (store) => store.music, { fireImmediately: false })
    playMusic(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY) {
            this.playMusicAudio(data.id);
        }
    }

    async playMusicAudio(id: string) {
        this.playAudio(id, this.musicSource, (clip) => {
            this.musicSource.play();
        });
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFX(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isGesture) {
            this.playSFXAudio(data.id);
        }
    }

    async playSFXAudio(id: string) {
        this.playAudio(id, this.sfxSource, (clip) => {
            this.sfxSource.playOneShot(clip);
        });
    }

    async playAudio(id: string, source: AudioSource, playFunction: (clip: AudioClip) => void) {
        const audioValue = this.audioConfigs?.[id];
        if (!audioValue) {
            return;
        }

        const audioClip = await this.loadAssets(audioValue, id);
        if (audioClip) {
            source.clip = audioClip;
            playFunction(audioClip);
        }
    }
}
