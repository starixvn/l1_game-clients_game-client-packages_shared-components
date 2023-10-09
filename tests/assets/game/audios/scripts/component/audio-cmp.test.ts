import gc from "@sg/game-client-base";
import AudioCmp from "db://shared-components/game/audios/scripts/component/audio-cmp";
import { Toggle } from "../../../../../../../../tests/cocos-testing/cc/toggle";

const { Audios } = gc;

describe("AudioCmp", () => {
    let component: AudioCmp;
    let toggle: Toggle;

    beforeEach(() => {
        toggle = new Toggle();
        component = new AudioCmp();
        component.toggle = toggle;
        toggle.isChecked = false;
    });

    describe("renderMusicComp", () => {
        it("updates display when type is MUSIC", () => {
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;

            component.type = Audios.AudioType.MUSIC;
            component.renderMusicComp(true);

            expect(updateDisplay).toHaveBeenCalledWith(true);
        });

        it("does not update display when type is not MUSIC", () => {
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;

            component.type = Audios.AudioType.SFX;
            component.renderMusicComp(true);

            expect(updateDisplay).not.toHaveBeenCalled();
        });
    });

    describe("renderSfxComp", () => {
        it("updates display when type is SFX", () => {
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;

            component.type = Audios.AudioType.SFX;
            component.renderSfxComp(true);

            expect(updateDisplay).toHaveBeenCalledWith(true);
        });

        it("does not update display when type is not SFX", () => {
            const updateDisplay = jest.fn();
            component.updateDisplay = updateDisplay;

            component.type = Audios.AudioType.MUSIC;
            component.renderSfxComp(true);

            expect(updateDisplay).not.toHaveBeenCalled();
        });
    });

    describe("onChangedAudio", () => {
        it("returns correct params", () => {
            component.type = Audios.AudioType.MUSIC;

            const result = component.onChangedAudio();

            expect(result).toEqual({
                type: Audios.AudioType.MUSIC,
                enable: false,
            });
        });
    });
});
