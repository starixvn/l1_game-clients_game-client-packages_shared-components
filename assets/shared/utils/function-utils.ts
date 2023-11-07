import { find, screen, Node } from "cc";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";

export namespace FunctionUtils {
    export const getNamespace = (currentNode?: Node) => {
        let gameNode: Node = null;
        let temp = currentNode;
        while (!gameNode && temp?.getParent()) {
            const parentNode = temp.getParent();
            if (parentNode.getComponent(GameComponentBase)) {
                gameNode = parentNode;
            } else {
                temp = parentNode;
            }
        }
        gameNode = gameNode ?? find("Canvas");
        const namespace = gameNode?.getComponent(GameComponentBase)?.namespace;

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
}
