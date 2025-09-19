import gc from "@sg/game-client-base";
import { Slider, _decorator } from "cc";
import Observer from "observer";

import AudioCmp from "db://shared-components/game/audios/scripts/component/audio-cmp";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { ObserverComponent } from "../../observer-component/scripts/observer-component";
import { CustomSlider } from "./custom-slider";
import { VolumeControlContainer } from "./volume-control-container";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("VolumeControl")
export class VolumeControl extends ObserverComponent {
    @property(CustomSlider)
    sliderBGM: CustomSlider = null;

    @property(CustomSlider)
    sliderSFX: CustomSlider = null;

    private audioContainer: AudioContainer = null;

    @property(AudioCmp)
    SFXAudioCmp: AudioCmp = null;

    @property(AudioCmp)
    BGMAudioCmp: AudioCmp = null;

    onLoad() {
        super.onLoad();
        this.sliderBGM?.node.on("slide", this.handleSlideBGM, this);
        this.sliderSFX?.node.on("slide", this.handleSlideSFX, this);
        this.loadAudioContainer();
    }

    loadAudioContainer() {
        this.audioContainer = this.node.parent?.getComponent(VolumeControlContainer)?.audioContainer;
        if (!this.audioContainer) {
            console.error("AudioContainer not found");
        }
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.sfxVolume)
    renderSFXValue(value: number) {
        this.sliderSFX.progress = value;
        this.sliderSFX.updateSliderBar(value);
        this.SFXAudioCmp.updateDisplay(value > 0);
    }

    @render(gc.UserSettings.UserSettingStore, (store) => store.bgmVolume)
    renderBGMValue(value: number) {
        this.sliderBGM.progress = value;
        this.sliderBGM.updateSliderBar(value);
        this.BGMAudioCmp.updateDisplay(value > 0);
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, value: number) => handle.setSfxVolume(value))
    handleSFX(value: number) {
        return value;
    }

    @handle(gc.UserSettings.UserSettingHandlers, (handle, value: number) => handle.setBGMVolume(value))
    handleBGM(value: number) {
        return value;
    }

    handleSlideBGM(slider: Slider) {
        this.handleBGM(slider.progress);
    }

    handleSlideSFX(slider: Slider) {
        this.handleSFX(slider.progress);
    }
}
