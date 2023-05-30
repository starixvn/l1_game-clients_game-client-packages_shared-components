import { _decorator, AudioClip, AudioSource, JsonAsset, log } from "cc";
import { bundleManager } from "../../../bundle-magager/bundle-manager";

import gc from "game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";

const { Audios, UserSettings } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

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

    audios = {};
    musicIds = [];

    onLoad() {
        super.onLoad();

        this.loadAudios().catch((error) => log(error));
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));
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
        const config = {
            ...this.sharedAudioConfig?.json,
            ...this.audioConfig?.json,
        };
        const keys = Object.keys(config);
        for (const key of keys) {
            const value = config[key];
            const bundle = value.bundle;
            const path = `audios/${value.path ?? key}`;
            const audioClip = await bundleManager.loadAssetsFromBundle(bundle, path, AudioClip, null);
            log("loaded audio ", key);
            this.audios[key] = audioClip;
            if (value.type && value.type === "music") {
                this.musicIds.push(key);
            }
        }

        this.registerMusicIds();
        this.audiosLoaded();
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}

    playSFXAudio(id: string) {
        if (this.audios[id]) {
            this.sfxSource.playOneShot(this.audios[id]);
        }
    }

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        if (!musicEnable) {
            this.musicSource.stop();
        }
    }

    playMusicAudio(id: string) {
        if (this.audios[id]) {
            this.musicSource.clip = this.audios[id];
            this.musicSource.play();
        }
    }

    @render(Audios.AudioStore, (store) => store.music, { fireImmediately: false })
    playMusic(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY) {
            this.playMusicAudio(data.id);
        }
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFX(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY) {
            this.playSFXAudio(data.id);
        }
    }
}
