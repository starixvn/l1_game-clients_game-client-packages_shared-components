import AudioManager from "db://shared-components/game/audios/scripts/audio-manager";

describe("AudioManager", () => {
    it("should return the singleton instance", () => {
        const manager1 = AudioManager.getInstance();
        const manager2 = AudioManager.getInstance();

        expect(manager1).toBe(manager2);
    });

    it("should allow getting and setting audio configs", () => {
        const configs = {
            music: {
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "mp3",
            },
        };

        AudioManager.audioConfigs(configs);

        const fetchedConfigs = AudioManager.audioConfigs();

        expect(fetchedConfigs).toEqual(configs);
    });

    describe("Language Support", () => {
        it("should handle audio configs with supported languages", () => {
            const configs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "mp3",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            AudioManager.audioConfigs(configs);

            const fetchedConfigs = AudioManager.audioConfigs();
            expect(fetchedConfigs.voice.supportedLanguages).toEqual(["en", "es", "fr"]);
        });

        it("should get audio info with language support", () => {
            const configs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "mp3",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            AudioManager.audioConfigs(configs);

            // Test with supported language
            const infoEn = AudioManager.getAudioInfo("voice", "en");
            expect(infoEn).toEqual({
                bundle: "game.bundle",
                path: "voices/en/greeting.mp3",
                type: "mp3",
            });

            // Test with unsupported language (should fallback to default)
            const infoDe = AudioManager.getAudioInfo("voice", "de");
            expect(infoDe).toEqual({
                bundle: "game.bundle",
                path: "voices/en/greeting.mp3",
                type: "mp3",
            });
        });

        it("should get audio path with language support", () => {
            const configs = {
                voice: {
                    bundle: "game.bundle",
                    path: "voices/{lang}/greeting.mp3",
                    type: "mp3",
                    supportedLanguages: ["en", "es", "fr"],
                },
            };

            AudioManager.audioConfigs(configs);

            // Test with supported language
            const pathEn = AudioManager.getAudioPath("voice", "en");
            expect(pathEn).toBe("voices/en/greeting.mp3");

            // Test with unsupported language (should fallback to default)
            const pathDe = AudioManager.getAudioPath("voice", "de");
            expect(pathDe).toBe("voices/en/greeting.mp3");
        });

        it("should handle audio configs without language support", () => {
            const configs = {
                music: {
                    bundle: "game.bundle",
                    path: "music/theme.mp3",
                    type: "mp3",
                },
            };

            AudioManager.audioConfigs(configs);

            // Should work normally without language parameter
            const info = AudioManager.getAudioInfo("music");
            expect(info).toEqual({
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "mp3",
            });

            // Should ignore language parameter if not supported
            const infoWithLang = AudioManager.getAudioInfo("music", "en");
            expect(infoWithLang).toEqual({
                bundle: "game.bundle",
                path: "music/theme.mp3",
                type: "mp3",
            });
        });
    });
});
