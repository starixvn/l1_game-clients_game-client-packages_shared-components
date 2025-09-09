import { AudioClip, AudioSource } from "cc";
import AudioManager from "db://shared-components/game/audios/scripts/audio-manager";
import { AudioContainer, TAudioConfigs } from "db://shared-components/game/audios/scripts/component/audio-container";

import { AudioUtils } from "db://shared-components/game/audios/utils";

describe("AudioContainer", () => {
    let component: AudioContainer;
    let musicSource: AudioSource;
    let sfxSource: AudioSource;
    let stoppableSFXSource: AudioSource;
    let mockTime: number;
    let audioConfigsMock: TAudioConfigs;
    let audioManagerInstance: AudioManager;

    beforeEach(() => {
        musicSource = new AudioSource();
        sfxSource = new AudioSource();
        component = new AudioContainer();
        component.musicSource = musicSource;
        component.sfxSource = sfxSource;
        component.stoppableSFXSource = stoppableSFXSource;
        const mockDate = new Date(2022, 1, 1);
        mockTime = mockDate.getTime();
        const dateSpy = jest.spyOn(global.Date.prototype, "getTime");
        dateSpy.mockReturnValueOnce(mockTime);
        audioConfigsMock = {
            test: {
                bundle: "123",
                path: "test",
                type: "music" as const,
            },
        };

        // Mock AudioManager instance
        audioManagerInstance = AudioManager.getInstance();
        jest.spyOn(audioManagerInstance, "setAudioConfigs").mockImplementation((configs) => {
            if (configs) {
                audioManagerInstance.audioConfigs = configs;
            }
            return audioManagerInstance.audioConfigs;
        });
    });

    describe("enableMusic", () => {
        it("stops music if disabled", () => {
            component.enableMusic(false);

            expect(component.musicSource.stop).toHaveBeenCalled();
        });
    });

    it("set audioConfigs method", () => {
        // Arrange
        const audioConfigsMock = {
            test: {
                bundle: "123",
                path: "test",
                type: "music" as const,
            },
        };

        // Act
        audioManagerInstance.setAudioConfigs(audioConfigsMock);

        // Assert
        expect(audioManagerInstance.audioConfigs).not.toBeNull();
    });

    describe("playMusicAudio", () => {
        it("plays clip on music source", async () => {
            // Arrange
            component.enableMusic(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip(),
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).toHaveBeenCalled();
        });

        it("not plays clip on music source when isPlay = false", async () => {
            // Arrange
            component.enableMusic(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip(),
                currentLoadAssetTime: mockTime,
                isPlay: false,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).not.toHaveBeenCalled();
        });

        it("not plays clip on music source when enable music = false", async () => {
            // Arrange
            component.enableMusic(false);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip(),
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });

            // Act
            await component.playMusicAudio("test");

            // Assert
            expect(component.musicSource.play).not.toHaveBeenCalled();
        });
    });

    describe("playSFXAudio", () => {
        it("plays clip on sfx source", async () => {
            // Arrange
            component.enableSFX(true);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip(),
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });
            component.setIsUserGesture = jest.fn().mockReturnValue(() => {
                return true;
            });

            // Act
            await component.playSFXAudio("test", false);

            // Assert
            expect(component.sfxSource.playOneShot).toHaveBeenCalled();
        });

        it("not plays clip on sfx source when without enable SFX ", async () => {
            // Arrange
            component.enableSFX(false);
            jest.spyOn(component, "loadAssets").mockResolvedValue({
                audioClip: new AudioClip(),
                currentLoadAssetTime: mockTime,
                isPlay: true,
            });
            component.setIsUserGesture = jest.fn().mockReturnValue(() => {
                return true;
            });

            // Act
            await component.playSFXAudio("test", false);

            // Assert
            expect(component.sfxSource.playOneShot).not.toHaveBeenCalled();
        });
    });

    describe("initConfigs...", () => {
        let audioConfigs: TAudioConfigs;
        beforeEach(() => {
            jest.clearAllMocks();
            audioConfigs = {
                audio1: {
                    bundle: "bundle1",
                    path: "path1",
                    type: "music",
                },
                audio2: {
                    bundle: "bundle2",
                    path: "path2",
                    type: "sfx",
                    isLazyLoad: false,
                },
                audio3: {
                    bundle: "bundle3",
                    path: "path3",
                    type: "music",
                    isLazyLoad: true,
                },
            };
            jest.spyOn(AudioUtils, "getAudioInfo").mockImplementation((value, audioKey) => ({
                bundle: value.bundle,
                path: value.path,
            }));
            jest.spyOn(AudioUtils, "getAudioClip");
        });
        it("should call getAudioInfo and getAudioClip for audio with isLazyLoad true", () => {
            // Arrange
            audioManagerInstance.setAudioConfigs(audioConfigs);

            // Act
            component.preloadAudio();

            // Assert
            expect(AudioUtils.getAudioInfo).toHaveBeenCalledWith(audioConfigs.audio1, "audio1");
            expect(AudioUtils.getAudioInfo).toHaveBeenCalledWith(audioConfigs.audio2, "audio2");
            expect(AudioUtils.getAudioClip).toHaveBeenCalledWith("bundle1", "path1");
            expect(AudioUtils.getAudioClip).toHaveBeenCalledWith("bundle2", "path2");
            expect(AudioUtils.getAudioInfo).not.toHaveBeenCalledWith(audioConfigs.audio3, "audio3");
            expect(AudioUtils.getAudioClip).not.toHaveBeenCalledWith("bundle3", "path3");
        });
    });
});
