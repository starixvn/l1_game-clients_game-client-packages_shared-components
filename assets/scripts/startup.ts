import gc from "game-client-base";
import mobx from "mobx";
import Observer from "observer";

export function startGame(namespace: string, containerOptions: gc.IContainerOptions) {
    const container = gc.getContainer(containerOptions);
    const observerContainer = gc.buildObserverContainer(container);

    Observer.configure({ [namespace]: { mobx, container: observerContainer } });

    return container;
}

export function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
        },
        enabledFeatures: [gc.Player.FEATURE_NAME, gc.Auth.FEATURE_NAME],
    };

    return gc.getContainer(containerOptions);
}
