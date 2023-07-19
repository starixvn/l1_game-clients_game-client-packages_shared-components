import gc from "@sg/game-client-base";
// import * as togleWeb from "@tolgee/web";
import mobx from "mobx";
import Observer from "observer";

const loadI18n = (siteConfigs: gc.Configs.SiteConfigs, gameNamespace: string) => {
    try {
        const isUseTolgeeRealTime = false; // temporary meanwhile finding solution for loading realtime
        //siteConfigs.env.toLocaleLowerCase().indexOf("local") >= 0 && !siteConfigs.isDev;
        const languageId = gc.Translator.getLanguageId();
        const languageCodes = ["en", "id", "th", "vi", "zh_cn", "zh_tw"];
        const translationOptions: gc.Shared.utils.TranslationOptions = {
            languageId: languageId,
            isUseTolgeeRealTime: isUseTolgeeRealTime,
            getStaticData: (languageId) => {
                return window["languages"][languageId];
            },
            availableLanguages: languageCodes,
            onLoaded: () => {
                console.log("started tolgee");
                console.log(gc.Translator.t("Common.bet_choice"));
                console.log(gc.Translator.gameTranslate("glossary_tie"));
                console.log(gc.Translator.commonTranslate("copyfailed_md5"));
            },
            gameNamespace: gameNamespace,
        };

        // if (isUseTolgeeRealTime) {
        //     siteConfigs.tolgee.defaultLanguage = languageId;
        //     siteConfigs.tolgee.defaultNs = "Common";
        //     siteConfigs.tolgee.ns = ["Common", "gameNames", "messages", "ui", "DragonTigerFight"];
        //     translationOptions.tg = togleWeb.Tolgee().use(togleWeb.DevTools()).init(siteConfigs.tolgee);
        // }

        gc.Translator.init(translationOptions);
    } catch (e) {
        console.log(e);
    }
};

export function startGame(namespace: string, containerOptions: gc.IContainerOptions, siteConfigs: gc.Configs.SiteConfigs) {
    loadI18n(siteConfigs, namespace);

    const container = gc.getContainer(containerOptions);
    const observerContainer = gc.buildObserverContainer(container);
    gc.sentryLogger.start(siteConfigs.sentryUrl, siteConfigs.env, namespace);

    Observer.configure({ [namespace]: { mobx, container: observerContainer } });

    return container;
}

export function getSharedContainer(siteConfigs: gc.Configs.SiteConfigs) {
    const containerOptions: gc.IContainerOptions = {
        onContainerCreated: (container) => {
            container.bind(gc.Configs.SiteConfigs).toConstantValue(siteConfigs);
        },
        enabledFeatures: [
            gc.Player.FEATURE_NAME,
            gc.Auth.FEATURE_NAME,
            gc.App.FEATURE_NAME,
            gc.Notification.FEATURE_NAME,
            gc.ConnectSite.FEATURE_NAME,
        ],
    };

    return gc.getContainer(containerOptions);
}
