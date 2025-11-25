import gc from "@sg/game-client-base";
import { _decorator, AudioClip, AudioSource, game, JsonAsset, log, sys, tween } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AudioUtils } from "../../utils";
import { audioManager } from "../audio-manager";

const { Audios, UserSettings, App, BrowserDomUtils } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export type TAudioConfigs = {
    [key: string]: TAudioValue;
};

export type TAudioValue = {
    bundle?: string;
    path: string;
    type?: "music" | "sfx";
    isMusicGame?: boolean;
    isLazyLoad?: boolean;
    isRemote?: boolean;
    remoteType?: "game" | "theme";
    supportedLanguages?: string[];
};

export type IRemoteThemeSoundConfigs = {
    version: number;
    defaultTheme: string;
    backgroundMusic: {
        version: number;
    };
    themes: string[];
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

    @property(AudioSource)
    stoppableSFXSource: AudioSource = null;

    @property
    isRemote = false;

    @property({
        visible: function () {
            return this.isRemote;
        },
    })
    remotePath = "";

    audios = [];
    musicIds = [];
    musicGameIds = [];
    protected isUserGesture = false;
    protected isPlayMusic = false;
    protected isPlaySFX = false;
    protected currentPlayTime = {};
    protected musicVolume = 0;
    protected sfxVolume = 0;

    get defaultLang() {
        return "en";
    }

    setIsUserGesture(isUserGesture: boolean) {
        this.isUserGesture = isUserGesture;
    }

    onLoad() {
        this.musicSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.musicSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));

        // The AudioContext was not allowed to start.
        // It must be resumed (or created) after a user gesture on the page
        this.initTouchBind();

        this.getRemoteConfigs().then(() => {
            this.initConfigs();
            super.onLoad();
            this.registerAudioHandlers();
            this.callPlayMusic();
            this.preloadAudio();
        });
    }

    onDestroy(): void {
        super.onDestroy();
        window.removeEventListener("message", this.handleSoundEventFromParent);
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.sfxVolume)
    renderSFXVolume(volume: number) {
        this.sfxVolume = volume;
        this.updateVolumeSfx(volume)
    }

    updateVolumeSfx(volume: number) {
        this.updateVolumeSFXSource(volume, 0.1);
        this.updateVolumeStoppableSFXSource(volume, 0.1);
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.bgmVolume)
    renderBGMVolume(volume: number) {
        this.musicVolume = volume;
        this.updateVolumeMusicSource(volume, 0.1);
    }

    setMusicVolumeScale(scale: number) {
        const volume = this.musicVolume * scale;
        this.updateVolumeMusicSource(volume, 0.1);
    }

    setSfxVolumeScale(scale: number) {
        const volume = this.sfxVolume * scale;
        this.updateVolumeSfx(volume);
    }

    getAudioConfigs(): TAudioConfigs {
        return {
            ...(this.sharedAudioConfig?.json ?? {}),
            ...(audioManager.remoteGameAudioConfigs?.sounds ?? {}),
            ...(audioManager.remoteThemeAudioConfigs ?? {}),
            ...(this.audioConfig?.json ?? {}),
        };
    }

    protected async initConfigs() {
        this.initializeAudioConfigs();
        this.categorizeAudioIds();
    }

    private async getRemoteConfigs() {
        try {
            await audioManager.getRemoteThemeConfigs();
            audioManager.defaultLang = this.defaultLang;
            await audioManager.getRemoteAudioThemeConfig();
            if (!!this.remotePath) {
                await audioManager.getRemoteGameConfigs(this.remotePath);
            }
        } catch (error) { }
    }

    protected initializeAudioConfigs() {
        audioManager.setAudioConfigs(this.getAudioConfigs());
    }

    protected categorizeAudioIds() {
        const audioConfigs = audioManager.audioConfigs;
        const keys = Object.keys(audioConfigs);

        for (const key of keys) {
            const value = audioConfigs[key];
            if (Object.keys(value).length === 0) {
                continue;
            }
            if (value.type === "music") {
                if (value?.isMusicGame) {
                    this.musicGameIds.push(key);
                } else {
                    this.musicIds.push(key);
                }
            } else {
                this.audios.push(key);
            }
        }
    }

    protected registerAudioHandlers() {
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

        window.addEventListener("message", this.handleSoundEventFromParent);
    }

    @handle(gc.App.AppHandlers.UserGesturePage, (handle, value: boolean) => handle.handleTouchScreen(value))
    updateTouchedScreen() {
        return true;
    }

    handleSoundEventFromParent = (event: MessageEvent) => {
        const { sfxEnable } = event.data;
        if (sfxEnable !== null && sfxEnable !== undefined) {
            this.switchSound(sfxEnable);
        }
    };

    preloadAudio() {
        const audioConfigs = audioManager?.audioConfigs || {};
        for (const [audioKey, value] of Object.entries(audioConfigs)) {
            if (value?.isLazyLoad !== true) {
                if (value?.isRemote) {
                    let url = "";
                    if (value?.remoteType === "game") {
                        url = AudioUtils.getGameAudioUrl(value, audioKey);
                    } else {
                        url = AudioUtils.getRemoteThemeAudioUrl(value, audioKey);
                    }

                    AudioUtils.getRemoteAudioClip(url);
                } else {
                    const { bundle, path } = AudioUtils.getAudioInfo(value, audioKey);
                    AudioUtils.getAudioClip(bundle, path);
                }
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
    audiosLoaded() { }

    @handle(Audios.AudioHandler, (handle) => handle.playRandomMusic())
    callPlayMusic() { }

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable, { fireImmediately: false })
    enableMusic(musicEnable: boolean) {
        this.isPlayMusic = musicEnable;
        if (!musicEnable) {
            this.stopAllMusic();
        }
    }

    protected stopAllMusic() {
        this.stopAudio(this.musicSource);
    }

    /**
     * Update volume of music source
     * @param volume 
     * @param duration 
     */
    updateVolumeMusicSource(volume: number, duration: number) {
        tween(this.musicSource).to(duration, { volume: volume }).start();
    }

    updateVolumeStoppableSFXSource(volume: number, duration: number) {
        tween(this.stoppableSFXSource).to(duration, { volume: volume }).start();
    }

    updateVolumeSFXSource(volume: number, duration: number) {
        tween(this.sfxSource).to(duration, { volume: volume }).start();
    }

    @render(UserSettings.UserSettingStore, (store) => store.sfxEnable)
    enableSFX(sfxEnable: boolean) {
        this.isPlaySFX = sfxEnable;
    }

    @render(Audios.AudioStore, (store) => store.music)
    playMusic(data: gc.Audios.AudioData) {
        if (data && data.action === Audios.AudioAction.PLAY) {
            this.playMusicAudio(data);
        }
    }

    async playMusicAudio(data: gc.Audios.AudioData) {
        const { id } = data;
        await this.playAudio(
            id,
            (clip, isPlay) => {
                this.handlePlayMusic(data, isPlay, clip);
            },
            this.isPlayMusic
        );
    }

    protected handlePlayMusic(data: gc.Audios.AudioData, isPlay: boolean, clip: AudioClip) {
        isPlay === this.isPlayMusic && this.playSourceClip(this.musicSource, clip);
    }

    protected stopAudio(audioSource: AudioSource) {
        audioSource?.stop();
    }

    @render(Audios.AudioStore, (store) => store.sfx, { fireImmediately: false })
    playSFX(data: gc.Audios.AudioData) {
        if (data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, false);
        }
    }

    @render(Audios.AudioStore, (store) => store.stoppableSFX)
    handleStoppableSFX(data: gc.Audios.AudioData) {
        if (data && data.action === Audios.AudioAction.PLAY && this.isUserGesture) {
            this.playSFXAudio(data.id, true);
        } else {
            this.currentPlayTime[data.id] = 0;
            this.stopAudio(this.stoppableSFXSource);
        }
    }

    async playSFXAudio(id: string, isStoppableSFX: boolean) {
        this.playAudio(
            id,
            (clip, isPlay) => {
                if (isPlay === this.isPlaySFX) {
                    isStoppableSFX ? this.playSourceClip(this.stoppableSFXSource, clip) : this.sfxSource.playOneShot(clip);
                }
            },
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

    async playAudio(id: string, playFunction: (clip: AudioClip, isPlay: boolean) => void, isCurrentPlaying: boolean) {
        const audioValue = audioManager?.audioConfigs?.[id];
        if (!audioValue || (this.currentPlayTime[id] !== undefined && this.currentPlayTime[id] > 0)) {
            log("playAudio can not play", id);
            return;
        }

        const currentTime = new Date().getTime();
        this.currentPlayTime[id] = currentTime;
        const { audioClip, currentLoadAssetTime, isPlay } = await this.loadAssets(audioValue, id, currentTime, isCurrentPlaying);

        if (audioClip) {
            if (this.currentPlayTime[id] !== currentLoadAssetTime) {
                log("playAudio can not play, different time ", id);
                return;
            }

            playFunction(audioClip, isPlay);
            this.currentPlayTime[id] = 0;
        }
    }

    loadAssets = async (
        audioValue: TAudioValue,
        soundId: string,
        currentLoadAssetTime: number,
        isPlay: boolean
    ): Promise<{ audioClip: AudioClip | null; currentLoadAssetTime: number; isPlay: boolean }> => {
        if (audioValue?.isRemote) {
            let url = "";
            if (audioValue?.remoteType === "game") {
                url = AudioUtils.getGameAudioUrl(audioValue, soundId);
            } else {
                url = AudioUtils.getRemoteThemeAudioUrl(audioValue, soundId);
            }

            const audioClip = await AudioUtils.getRemoteAudioClip(url);
            return { audioClip, currentLoadAssetTime, isPlay };
        }

        // Handle local sounds
        const { bundle, path } = AudioUtils.getAudioInfo(audioValue, soundId);
        if (!bundle || !path) {
            return { audioClip: null, currentLoadAssetTime: 0, isPlay: false };
        }

        const audioClip = await AudioUtils.getAudioClip(bundle, path);
        return { audioClip, currentLoadAssetTime, isPlay };
    };
}
