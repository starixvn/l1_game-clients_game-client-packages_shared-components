import AudioManager, { audioManager } from "db://shared-components/game/audios/scripts/audio-manager";
import { TAudioConfigs } from "db://shared-components/game/audios/scripts/component/audio-container";

describe("AudioManager", () => {
    it("should return the singleton instance", () => {
        const manager1 = AudioManager.getInstance();
        const manager2 = AudioManager.getInstance();

        expect(manager1).toBe(manager2);
    });

    it("should allow getting and setting audio configs", () => {
        const configs: TAudioConfigs = {
            music: {
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "music",
            },
        };

        audioManager.setAudioConfigs(configs);

        const fetchedConfigs = audioManager.audioConfigs;

        expect(fetchedConfigs).toEqual(configs);
    });

    describe("Language Support", () => {
        it("should handle audio configs with supported languages", () => {
            const configs: TAudioConfigs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "sfx",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            audioManager.setAudioConfigs(configs);

            const fetchedConfigs = audioManager.audioConfigs;
            expect(fetchedConfigs.voice.supportedLanguages).toEqual(["en", "es", "fr"]);
        });

        it("should get audio info with language support", () => {
            const configs: TAudioConfigs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "sfx",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            audioManager.setAudioConfigs(configs);

            // Test with supported language
            const infoEn = audioManager.getAudioInfo("voice", "en");
            expect(infoEn).toEqual({
                bundle: "game.bundle",
                path: "voices/en/greeting.mp3",
                type: "sfx",
            });

            // Test with unsupported language (should fallback to default)
            const infoDe = audioManager.getAudioInfo("voice", "de");
            expect(infoDe).toEqual({
                bundle: "game.bundle",
                path: "voices/en/greeting.mp3",
                type: "sfx",
            });
        });

        it("should get audio path with language support", () => {
            const configs: TAudioConfigs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "sfx",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            audioManager.setAudioConfigs(configs);

            // Test with supported language
            const pathEn = audioManager.getAudioPath("voice", "en");
            expect(pathEn).toBe("voices/en/greeting.mp3");

            // Test with unsupported language (should fallback to default)
            const pathDe = audioManager.getAudioPath("voice", "de");
            expect(pathDe).toBe("voices/en/greeting.mp3");
        });

        it("should handle audio configs without language support", () => {
            const configs: TAudioConfigs = {
                music: {
                    bundle: "game.bundle",
                    path: "music/theme.mp3",
                    type: "music",
                },
            };

            audioManager.setAudioConfigs(configs);

            // Should work normally without language parameter
            const info = audioManager.getAudioInfo("music");
            expect(info).toEqual({
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "music",
            });

            // Should ignore language parameter if not supported
            const infoWithLang = audioManager.getAudioInfo("music", "en");
            expect(infoWithLang).toEqual({
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "music",
            });
        });
    });
});
