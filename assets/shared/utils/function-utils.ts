import { find } from "cc";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";

export namespace FunctionUtils {
    export const getNamespace = () => {
        const namespace = find("Canvas").getComponent(GameComponentBase)?.namespace;

        return namespace || window?.envConfig?.mainObserverNamespace || "default";
    };

    export const delayMilliseconds = async (ms: number) => {
        let timeoutId: NodeJS.Timeout;
        const promise = new Promise<void>((resolve) => {
            timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
            }, ms);
        });

        return promise;
    };

    export const waitUntil = async (condition: Function, interval = 1000, maxWait = 5000): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const startTime = new Date().getTime();
            let timeoutId: NodeJS.Timeout;

            const checkCondition = async () => {
                try {
                    if (await condition()) {
                        resolve();
                    } else if (new Date().getTime() - startTime <= maxWait) {
                        timeoutId = setTimeout(checkCondition, interval);
                    } else {
                        resolve(); // Max wait time exceeded
                    }
                } catch (e) {
                    reject(e);
                }
            };

            checkCondition(); // Start checking immediately
        });
    };
}
