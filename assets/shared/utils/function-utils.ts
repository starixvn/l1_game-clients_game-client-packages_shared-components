import { Asset, Node, assetManager, find, screen, warn, JsonAsset } from "cc";
import gc from "@sg/game-client-base";
import { settings } from "../../../../../assets/game/scripts/game-settings";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";
import { siteConfigs } from "../../../../../assets/scripts/site-configs";

export namespace FunctionUtils {
    export const cachedRemoteFile = {};
    export const loadRemote = (url: string) => {
        return new Promise((resolve, reject) => {
            assetManager.loadRemote(url, (err, data: Asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data);
            });
        });
    };

    export const getNamespace = () => {
        if (settings?.observerNamespace) {
            return settings.observerNamespace;
        }
        const canvas = find("Canvas");
        const gameComponentBases = canvas?.getComponentsInChildren(GameComponentBase);
        if (!gameComponentBases || gameComponentBases.length === 0) {
            return "default";
        }
        const namespace = gameComponentBases[0]?.namespace;
        return namespace || "default";
    };
    export const isIpad = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    };

    export const isPortraitMode = (): boolean => {
        const frameSize = screen.windowSize;
        return frameSize.width < frameSize.height;
    };

    /**
     * @deprecated Use AnimationUtils.delayTime instead
     */
    export const delay = async (milliseconds: number) => {
        let timeoutId: NodeJS.Timeout;
        return new Promise<void>((resolve) => {
            timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
            }, milliseconds);
        });
    };

    export const waitUntil = async (condition: Function, interval = 1000, maxWait = 5000): Promise<void> => {
        if (condition()) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            const startTime = new Date().getTime();
            let timeoutId: NodeJS.Timeout;

            const clearTimer = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            const checkCondition = async () => {
                try {
                    if (await condition()) {
                        resolve();
                    } else if (new Date().getTime() - startTime <= maxWait) {
                        timeoutId = setTimeout(checkCondition, interval);
                    } else {
                        clearTimer();
                        resolve(); // Max wait time exceeded
                    }
                } catch (e) {
                    reject(e);
                }
            };

            checkCondition();
        });
    };

    export const asyncExecute = async <T>(node: Node, promiseValue: Promise<T>): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            const errorMessage = "Node is not valid!.";
            if (!node?.isValid) {
                reject(new Error(errorMessage));
            } else {
                promiseValue
                    .then((result) => {
                        if (!node?.isValid) {
                            reject(new Error(errorMessage));
                        } else {
                            resolve(result);
                        }
                    })
                    .catch((err) => {
                        warn("----asyncExecute----:", err);
                        reject(new Error(errorMessage));
                    });
            }
        });
    };

    export const isLocalhost = (): boolean => {
        const { origin } = window.location;
        return origin.includes("localhost");
    };

    // Remote Game Resource Utilities

    /** Cache for remote localization data indexed by game ID */
    export const remoteLocalization: Record<number, any> = {};

    /** Cache for remote version data indexed by game ID */
    export const versionsCache: Record<number, any> = {};

    /**
     * Builds the URL for remote game resources
     * @param gameId - The ID of the game
     * @param pathResource - The path to the resource
     * @returns The complete URL for the remote resource
     */
    export const remoteGameResourceUrl = (gameId: number, pathResource: string): string => {
        const url = gc.UrlUtils.buildMicrositeGameUrl(siteConfigs, gameId);
        return `${url}/remote/${pathResource}`;
    };


    /**
     * Loads a remote game resource for the specified game
     * @param gameId - The ID of the game
     * @param pathResource - The path to the resource
     * @returns Promise that resolves to the loaded asset
     */
    export const loadRemoteGameResource = <T>(gameId: number, pathResource: string): Promise<T> => {
        return loadRemote(remoteGameResourceUrl(gameId, pathResource)) as Promise<T>;
    };

    /**
     * Gets the remote version information for a game
     * @param gameId - The ID of the game
     * @returns Promise that resolves to the version data
     */
    export const getRemoteVersion = async (gameId: number): Promise<any> => {
        if (!versionsCache[gameId]) {
            const versionsAsset = await loadRemote(`${remoteGameResourceUrl(gameId, "versions.json")}?v=${Date.now()}`) as JsonAsset;
            versionsCache[gameId] = versionsAsset?.json || {};
        }
        return versionsCache[gameId];
    };

    /**
     * Loads remote localization data for a game
     * @param gameId - The ID of the game
     */
    export const loadRemoteLocalization = async (gameId: number): Promise<void> => {
        if (!remoteLocalization[gameId]) {
            const versions = await getRemoteVersion(gameId);
            const localizationVersion = versions?.localization ?? Date.now();
            const localization = await loadRemoteGameResource<JsonAsset>(gameId, `localization.json?v=${localizationVersion}`);
            remoteLocalization[gameId] = localization?.json || {};
        }
    };

    /**
     * Gets the display name for a game from remote localization
     * @param gameId - The ID of the game
     * @param breakline - Whether to include lobby names in the search
     * @returns The display name of the game, or empty string if not found
     */
    export const getRemoteDisplayGameName = async (gameId: number, breakline = false): Promise<string> => {
        try {
            await loadRemoteLocalization(gameId);
            const list = ["generalGameNames", "gameNames"];
            breakline && list.unshift("lobbyNames");

            const currentLanguage = gc.Translator.getCurrentLanguageId();
            const key = list.find((key) => getRemoteTranslation(gameId, key, currentLanguage));
            if (!key) {
                return getRemoteTranslation(gameId, "gameNames", "en") || "";
            }
            return getRemoteTranslation(gameId, key, currentLanguage) || "";
        } catch (error) {
            console.error("An error occurred in getRemoteDisplayGameName:", error);
            return "";
        }
    };

    /**
     * Gets a translation value from remote localization data
     * @param gameId - The ID of the game
     * @param key - The translation key
     * @param language - The language code
     * @returns The translated string, or undefined if not found
     */
    export const getRemoteTranslation = (gameId: number, key: string, language: string): string | undefined => {
        return remoteLocalization[gameId]?.[key]?.[language];
    };

    export const getDisplayGameName = async (gameId: number, gameConfiguration?: gc.GameConfiguration.TGameConfiguration, breakline = false): Promise<string> => {
        if (gameConfiguration?.isMicrosite) {
            return getRemoteDisplayGameName(gameId, breakline);
        }
        return gameConfiguration?.name || "";
    }
}
