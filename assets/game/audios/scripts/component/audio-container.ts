import { AudioClip, AudioSource, JsonAsset, _decorator, game, log, sys } from "cc";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AudioUtils } from "../../utils";
import AudioManager from "../audio-manager";

const { Audios, UserSettings, App, BrowserDomUtils, AppTypes, Auth } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export type TAudioConfigs = {
    [key: string]: TAudioValue;
};

export type TAudioValue = {
    bundle: string;
    path: string;
    type: string;
    isMusicGame?: boolean;
    isLazyLoad?: boolean;
};

export enum ECurrentPlayTime {
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

    @property(AudioSource)
    sfxExtraSource: AudioSource = null;

    audios = [];
    musicIds = [];
    musicGameIds = [];
    protected isUserGesture = false;
    protected isPlayMusic = false;
    protected isPlaySFX = false;
    protected currentPlayTime = {
        [ECurrentPlayTime.playMusic]: 0,
        [ECurrentPlayTime.playSFX]: 0,
    };

    private sfxExtra: gc.Audios.AudioData = null;
    private readonly sfxExtraSound = "sfx_extra";

    setIsUserGesture(isUserGesture: boolean) {
        this.isUserGesture = isUserGesture;
    }

    onLoad() {
        super.onLoad();
        this.loadAudios().catch((error) => log(error));
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));

        // The AudioContext was not allowed to start.
        // It must be resumed (or created) after a user gesture on the page
        this.initTouchBind();
    }

    async loadAudios() {
        const audioConfigs: TAudioConfigs = {
            ...this.sharedAudioConfig?.json,
            ...this.audioConfig?.json,
        };

        AudioManager.audioConfigs(audioConfigs);
        const keys = Object.keys(audioConfigs);
        for (const key of keys) {
            const value = audioConfigs[key];
            if (value.type === "music") {
                this.musicIds.push(key);
            } else {
                this.audios.push(key);
            }
            if (value?.isMusicGame) {
                this.musicGameIds.push(key);
            }
        }

        this.registerMusicIds();
        this.registerMusicGameIds();
        this.audiosLoaded();
    }

    protected initTouchBind() {
        const touchEvent = "ontouchend" in window ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];
        const [touchStartEvent, touchEndEvent] = touchEvent;

        const handleTouchEvent = () => {
            this.isUserGesture = true;
            this.postMessageUserGestureToParent();
            this.updateTouchedScreen();
        };

        game.canvas.addEventListener(touchStartEvent, handleTouchEvent);
        game.canvas.addEventListener(touchEndEvent, handleTouchEvent);

        window.addEventListener("message", this.handleSoundEventFromParent.bind(this));
    }

    @handle(gc.App.AppHandlers.UserGesturePage, (handle, value: boolean) => handle.handleTouchScreen(value))
    updateTouchedScreen() {
        return true;
    }

    @render(App.AppStore, (store) => store.isTouchedScreen, { fireImmediately: false })
    playSFXExtra(isTouchedScreen: boolean) {
        if (this.isPlaySFX && isTouchedScreen && this.sfxExtra && this.sfxExtra.action === Audios.AudioAction.PLAY) {
            this.playSFXExtraAudio(this.sfxExtra.id);
        }
    }

    handleSoundEventFromParent(event: MessageEvent) {
        const { sfxEnable } = event.data;
        if (sfxEnable !== null && sfxEnable !== undefined) {
            this.switchSound(sfxEnable);
        }
    }

    start() {
        const audioConfigs = AudioManager?.audioConfigs() || {};
        for (const [audioKey, value] of Object.entries(audioConfigs)) {
            if (value?.isLazyLoad !== true) {
                const { bundle, path } = AudioUtils.getAudioInfo(value, audioKey);
                AudioUtils.getAudioClip(bundle, path);
            }
        }
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, sfxEnable: boolean) => handle.setSfxEnable(sfxEnable))
    private switchSound(sfxEnable: boolean) {
        return sfxEnable;
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

    @handle(gc.Audios.AudioHandler, (handle, ids: string[]) => handle.setMusicGameIds(ids))
    registerMusicGameIds() {
        return this.musicGameIds;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        this.isPlayMusic = musicEnable;
        if (!musicEnable) {
            this.stopAudio(this.musicSource);
        }
    }

    @render(UserSettings.UserSettingStore, (store) => store.sfxEnable)
    enableSFX(sfxEnable: boolean) {
        this.isPlaySFX = sfxEnable;
        if (sfxEnable) {
            this.sfxExtra && this.sfxExtra.action === Audios.AudioAction.PLAY && this.playSFXExtraAudio(this.sfxExtraSound);
        } else {
            this.sfxExtraSource && this.stopSourceClip(this.sfxExtraSource, this.sfxExtraSource.clip);
        }
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
                isPlay === this.isPlayMusic && this.playSourceClip(this.musicSource, clip);
            },
            ECurrentPlayTime.playMusic,
            this.isPlayMusic
        );
    }

    protected stopAudio(audioSource: AudioSource) {
        audioSource.stop();
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    handleSFX(data: gc.Audios.AudioData) {
        if (data.id === this.sfxExtraSound) {
            this.sfxExtra = data;
        }
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            if (data.id === this.sfxExtraSound) {
                this.isPlaySFX && this.playSFXExtraAudio(data.id);
            } else {
                this.playSFXAudio(data.id);
            }
        } else if (data.action === Audios.AudioAction.STOP) {
            this.stopSourceClip(this.sfxExtraSource, this.sfxExtraSource.clip);
        }
    }

    async playSFXAudio(id: string) {
        this.playAudio(
            id,
            (clip, isPlay) => {
                if (isPlay === this.isPlaySFX) {
                    this.sfxSource.playOneShot(clip);
                }
            },
            ECurrentPlayTime.playSFX,
            this.isPlaySFX
        );
    }

    async playSFXExtraAudio(id: string) {
        this.playAudio(
            id,
            (clip, isPlay) => {
                if (isPlay === this.isPlaySFX) {
                    this.playSourceClip(this.sfxExtraSource, clip);
                }
            },
            ECurrentPlayTime.playSFX,
            this.isPlaySFX
        );
    }

    protected playSourceClip(audioSource: AudioSource, audioClip: AudioClip) {
        audioSource.clip = audioClip;
        audioSource.play();
    }

    protected stopSourceClip(audioSource: AudioSource, audioClip: AudioClip) {
        audioSource.clip = audioClip;
        audioSource.stop();
    }

    async playAudio(
        id: string,
        playFunction: (clip: AudioClip, isPlay: boolean) => void,
        currentTimeField: string,
        isCurrentPlaying: boolean
    ) {
        const audioValue = AudioManager?.audioConfigs()?.[id];
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

    loadAssets = async (
        audioValue: TAudioValue,
        soundId: string,
        currentLoadAssetTime: number,
        isPlay: boolean
    ): Promise<{ audioClip: AudioClip | null; currentLoadAssetTime: number; isPlay: boolean }> => {
        const { bundle, path } = AudioUtils.getAudioInfo(audioValue, soundId);

        if (!bundle || !path) {
            return { audioClip: null, currentLoadAssetTime: 0, isPlay: false };
        }

        const audioClip = await AudioUtils.getAudioClip(bundle, path);

        return { audioClip, currentLoadAssetTime, isPlay };
    };

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSFXExtra() {
        return this.sfxExtraSound;
    }
}
