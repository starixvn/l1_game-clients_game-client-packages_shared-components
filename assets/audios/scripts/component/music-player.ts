import { _decorator, Component } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { Audios, UserSettings } = gc;
const { ccclass, property } = _decorator;
const { useObserver, render, handle } = Observer;

@ccclass
export default class MusicPlayer extends Component {
    @property
    namespaceObserver = "default";

    private dispose: any;

    onLoad() {
        this.dispose = useObserver(this, this.namespaceObserver);
    }

    onDestroy() {
        this.dispose();
    }

    @render(Audios.AudioStore, (store) => store.musicState, { fireImmediately: false })
    playNext(state: gc.Audios.MusicState) {
        if (state == gc.Audios.MusicState.ENDED) {
            this.callPlayMusic();
        }
    }

    @render(UserSettings.UserSettingStore, (store) => store.musicEnable)
    enableMusic(musicEnable: boolean) {
        if (musicEnable) {
            this.callPlayMusic();
        }
    }

    @render(Audios.AudioStore, (store) => store.startMusicPlayer, { fireImmediately: false })
    startMusicPlayer() {
        this.callPlayMusic();
    }

    @handle(Audios.AudioHandler, (handle) => handle.playRandomMusic())
    callPlayMusic() {}
}
