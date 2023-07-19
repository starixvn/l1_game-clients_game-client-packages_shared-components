import gc from "@sg/game-client-base";
// import * as togleWeb from "@tolgee/web";
import mobx from "mobx";
import Observer from "observer";

// const loadI18n = (siteConfigs: gc.Configs.SiteConfigs) => {
//     try {
//         const isUseTolgeeRealTime = siteConfigs.env.toLocaleLowerCase().indexOf("local") >= 0 && !siteConfigs.isDev;
//         const languageId = gc.Shared.utils.TranslationManager.getLanguageId();
//         const languageCodes = ["en", "id", "th", "vi", "zh_cn", "zh_tw"];
//         const translationOptions: gc.Shared.utils.TranslationOptions = {
//             languageId: languageId,
//             isUseTolgeeRealTime: isUseTolgeeRealTime,
//             getStaticData: (languageId) => {
//                 return window["languages"][languageId];
//             },
//             availableLanguages: languageCodes,
//             onLoaded: () => {
//                 console.log("started tolgee");
//                 console.log(gc.Shared.utils.TranslationManager.translate("Common.bet_choice"));
//             },
//         };

//         if (isUseTolgeeRealTime) {
//             siteConfigs.tolgee.defaultLanguage = languageId;
//             siteConfigs.tolgee.defaultNs = "Common";
//             siteConfigs.tolgee.ns = ["Common", "gameNames", "messages", "ui", "DragonTigerFight"];
//             translationOptions.tg = togleWeb.Tolgee().use(togleWeb.DevTools()).init(siteConfigs.tolgee);
//         }

//         gc.Shared.utils.TranslationManager.init(translationOptions);
//     } catch (e) {
//         console.log(e);
//     }
// };

export function startGame(namespace: string, containerOptions: gc.IContainerOptions, siteConfigs: gc.Configs.SiteConfigs) {
    //loadI18n(siteConfigs);

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
