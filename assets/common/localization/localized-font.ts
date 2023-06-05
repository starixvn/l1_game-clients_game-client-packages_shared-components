import { CCBoolean, Component, Font, Label, _decorator } from "cc";
import { l10n } from "../../../../localization-editor/static/assets/l10n";
import { bundleManager } from "../../bundle-magager/bundle-manager";

const { ccclass, property } = _decorator;

class LanguageFont {
    language = "";
    name: "";
}

@ccclass("LocalizedFont")
export class LocalizedFont extends Component {
    @property({ type: LanguageFont })
    overrideFonts: LanguageFont[] = [];

    @property(CCBoolean)
    enableCacheMode = false;

    label: Label = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(Label);
        this.updateFont();
    }

    initData() {
        this.fontBases = {
            vi: "noto-serif-regular",
            id: "noto-serif-regular",
            en: "noto-serif-regular",
            th: "noto-serif-regular-thai",
            "zh-Hans": "noto-serif-regular-zhcn",
            "zh-Hant": "noto-serif-regular-zhtw",
        };
    }

    updateFont() {
        const name = this.getFontNameByLanguage();
        if (this.label) {
            this.loadFont(name)
                .then((font) => {
                    if (this.label.isValid) {
                        this.label.font = font;
                        this.enableCacheMode && this.handleCacheMode();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    handleCacheMode() {
        const lang = l10n.currentLanguage;
        switch (lang) {
            case "th":
            case "zh-Hans":
            case "zh-Hant":
                this.label.cacheMode = Label.CacheMode.BITMAP;
                break;

            default:
                this.label.cacheMode = Label.CacheMode.CHAR;
                break;
        }
    }

    getFontNameByLanguage(): any {
        const lang = l10n.currentLanguage;
        const overrideFonts = this.overrideFonts.find((data) => data.language === lang);
        return overrideFonts?.name || this.fontBases[lang] || this.fontBases["en"];
    }

    loadFont(name: string) {
        return bundleManager.loadSharedAsset<Font>(`fonts/${name}`, Font);
    }
}
