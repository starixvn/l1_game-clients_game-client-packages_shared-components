import { Slider, _decorator } from "cc";
import Observer from "observer";

import AudioCmp from "db://shared-components/game/audios/scripts/component/audio-cmp";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { ObserverComponent } from "../../observer-component/scripts/observer-component";
import { VolumeHandlers, VolumeStore } from "../handlers";
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
        this.loadStorage();
        this.loadAudioContainer();
    }

    @handle(VolumeHandlers, (handle) => handle.onLoadStorage())
    loadStorage() {}

    loadAudioContainer() {
        this.audioContainer = this.node.parent?.getComponent(VolumeControlContainer)?.audioContainer;
        if (!this.audioContainer) {
            console.error("AudioContainer not found");
        }
    }

    @render(VolumeStore, (store) => store.SFXVolume)
    renderSFXValue(value: number) {
        this.sliderSFX.progress = value;
        this.updateSFXVolume(value);
        this.sliderSFX.updateSliderBar(value);
    }

    @render(VolumeStore, (store) => store.BGMVolume)
    renderBGMValue(value: number) {
        this.sliderBGM.progress = value;
        this.updateBGMVolume(value);
        this.sliderBGM.updateSliderBar(value);
    }

    @handle(VolumeHandlers, (handle, value: number) => handle.handleSFX(value))
    handleSFX(value: number) {
        return value;
    }

    @handle(VolumeHandlers, (handle, value: number) => handle.handleBGM(value))
    handleBGM(value: number) {
        return value;
    }

    handleSlideBGM(slider: Slider) {
        this.handleBGM(slider.progress);
    }

    handleSlideSFX(slider: Slider) {
        this.handleSFX(slider.progress);
    }

    updateSFXVolume(value: number) {
        this.audioContainer.updateVolumeStoppableSFXSource(value, 0.1);
        this.audioContainer.updateVolumeSFXSource(value, 0.1);
        this.SFXAudioCmp.updateDisplay(value > 0);
    }

    updateBGMVolume(value: number) {
        this.audioContainer.updateVolumeMusicSource(value, 0.1);
        this.BGMAudioCmp.updateDisplay(value > 0);
    }
}
