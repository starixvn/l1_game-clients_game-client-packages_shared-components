import { _decorator, Component, Enum, Toggle } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { Audios } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle, useObserver } = Observer;

@ccclass
export default class AudioCmp extends Component {
    @property
    namespaceObserver = "default";

    @property({ type: Enum(Audios.AudioType) })
    type = Audios.AudioType.SFX;

    @property(Toggle)
    toggle: Toggle = null;

    private dispose: any;

    onLoad() {
        this.dispose = useObserver(this, this.namespaceObserver);
    }

    onDestroy() {
        this.dispose();
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.musicEnable)
    renderMusicComp(enable: boolean) {
        if (this.type !== Audios.AudioType.MUSIC) {
            return;
        }
        this.updateDisplay(enable);
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.sfxEnable)
    renderSfxComp(enable: boolean) {
        if (this.type !== Audios.AudioType.SFX) {
            return;
        }
        this.updateDisplay(enable);
    }

    updateDisplay(enable: boolean) {
        if (this.toggle) {
            this.toggle.isChecked = enable;
        }
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, param: { type: number; enable: boolean }) =>
        handle.handleAudioChanged(param.type, param.enable)
    )
    onChangedAudio() {
        return { type: this.type, enable: this.toggle.isChecked };
    }
}
