import gc from "@sg/game-client-base";
import mobx from "mobx";
import Observer from "observer";
import { loadI18n } from "./../../shared/scripts/startup";

export function startMultiplayGames(containersOptions: { [gameName: string]: gc.IContainerOptions }, siteConfigs: gc.Configs.SiteConfigs) {
    loadI18n(siteConfigs, siteConfigs.mainObserverNamespace);
    gc.sentryLogger.start(siteConfigs.sentryUrl, siteConfigs.env, siteConfigs.mainObserverNamespace);
    Object.keys(containersOptions).forEach((key) => {
        const container = gc.getContainer(containersOptions[key]);
        const observerContainer = gc.buildObserverContainer(container);

        Observer.configure({ [key.toLowerCase()]: { mobx, container: observerContainer } });
    });
}
