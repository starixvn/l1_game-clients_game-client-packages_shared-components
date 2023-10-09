import gc from "@sg/game-client-base";
import MusicPlayer from "db://shared-components/game/audios/scripts/component/music-player";

const { Audios } = gc;

describe("MusicPlayer", () => {
    let component: MusicPlayer;

    beforeEach(() => {
        component = new MusicPlayer();
    });

    describe("playNext", () => {
        it("calls playMusic when state is ENDED", () => {
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            component.playNext(Audios.MusicState.ENDED);

            expect(callPlayMusic).toHaveBeenCalled();
        });
    });

    describe("enableMusic", () => {
        it("calls playMusic when musicEnable is true", () => {
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            component.enableMusic(true);

            expect(callPlayMusic).toHaveBeenCalled();
        });
    });

    describe("startMusicPlayer", () => {
        it("calls playMusic", () => {
            const callPlayMusic = jest.fn();
            component.callPlayMusic = callPlayMusic;

            component.startMusicPlayer();

            expect(callPlayMusic).toHaveBeenCalled();
        });
    });
});
