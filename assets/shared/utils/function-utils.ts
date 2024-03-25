import { Node, find, screen, sys, warn } from "cc";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";
import gc from "@sg/game-client-base";

const { Configs, StorageManager, localStorageKeys } = gc;

export namespace FunctionUtils {
    export const getNamespace = () => {
        const namespace = find("Canvas").getComponent(GameComponentBase)?.namespace;

        return namespace || window?.envConfig?.mainObserverNamespace || "default";
    };
    export const isIpad = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    };

    export const isPortraitMode = (): boolean => {
        const frameSize = screen.windowSize;
        return frameSize.width < frameSize.height;
    };

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

    export const isSabaPlay = (): boolean => {
        const operator = StorageManager.get(localStorageKeys?.operator);
        console.log("isSabaPlay", operator);
        return operator.toString().toUpperCase() === "SP";
    };

    export const getLogoByOperator = (systemType: string): string => {
        const isSystemSG = systemType === Configs.SystemConfigs.SG.name;
        if (isSystemSG) {
            return "logo-SG";
        } else {
            return isSabaPlay() ? "logo-SP" : "logo-VG";
        }
    };

    export const getBackCardByOperator = (systemType: string): string => {
        const isSystemSG = systemType === Configs.SystemConfigs.SG.name;
        if (isSystemSG) {
            return "back-SG";
        } else {
            return isSabaPlay() ? "back-SP" : "back-VG";
        }
    };
}
