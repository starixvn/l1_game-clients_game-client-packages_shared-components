import gc from "@sg/game-client-base";
import { CCBoolean, Component, Font, Label, RichText, TTFFont, _decorator } from "cc";
import { bundleManager } from "../bundle-manager/bundle-manager";
const { Translator } = gc;

const { ccclass, property } = _decorator;

class LanguageFont {
    language = "";
    name: "";
    loadRemote: false;
}

export type FontMapping = {
    [key: string]: {
        name: string;
        loadRemote: boolean;
    };
};

@ccclass("LocalizedFont")
export class LocalizedFont extends Component {
    @property({ type: LanguageFont })
    overrideFonts: LanguageFont[] = [];

    @property(CCBoolean)
    enableCacheMode = false;

    label: Label = null;
    richText: RichText = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(Label);
        this.richText = this.node.getComponent(RichText);
        this.updateFont();
    }

    initData() {
        const notoRegular = "noto-serif-regular";
        this.fontBases = {
            vi: {
                name: notoRegular,
                loadRemote: false,
            },
            id: {
                name: notoRegular,
                loadRemote: false,
            },
            en: {
                name: notoRegular,
                loadRemote: false,
            },
            th: {
                name: "noto-serif-regular-thai",
                loadRemote: false,
            },
            zh_cn: {
                name: "noto-serif-regular-zhcn",
                loadRemote: false,
            },
            zh_tw: {
                name: "noto-serif-regular-zhtw",
                loadRemote: false,
            },
            ...globalThis?.fontRegularMapping,
        } as FontMapping;
    }

    updateFont() {
        const { name, loadRemote } = this.getFontNameByLanguage();
        if (this.label) {
            this.loadFont(name, loadRemote)
                .then((font) => {
                    if (this.label?.isValid) {
                        this.label.font = font;
                        this.enableCacheMode && this.handleCacheMode();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (this.richText) {
            this.loadFont(name, loadRemote)
                .then((font) => {
                    if (this.richText?.isValid) {
                        this.richText.font = font as TTFFont;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    handleCacheMode() {
        const lang = Translator.getCurrentLanguageId();
        switch (lang) {
            case "th":
            case "zh_cn":
            case "zh_tw":
                this.label.cacheMode = Label.CacheMode.BITMAP;
                break;

            default:
                this.label.cacheMode = Label.CacheMode.CHAR;
                break;
        }
    }

    getFontNameByLanguage(): any {
        const lang = Translator.getCurrentLanguageId();
        const overrideFonts = this.overrideFonts.find((data) => data.language === lang);
        const overrideFont = overrideFonts === undefined ? this.fontBases[lang] : overrideFonts;
        return overrideFont || this.fontBases["en"];
    }

    loadFont(name: string, loadRemote: boolean) {
        if (loadRemote) {
            const buildRemoteUrl = gc.UrlUtils.buildShareResource(globalThis.envConfig);
            return bundleManager.getRemoteAsset<Font>(`${buildRemoteUrl}/localization/fonts/${name}`);
        }
        return bundleManager.loadSharedAsset<Font>(`fonts/${name}`, Font);
    }
}
