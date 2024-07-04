import gc from "@sg/game-client-base";
import { Component, Label, _decorator } from "cc";
const { Translator } = gc;

const { ccclass, property } = _decorator;

@ccclass("LanguageFontSize")
export class LanguageFontSize {
    @property
    language = "";

    @property
    size = 0;
}

@ccclass("LocalizedFontSize")
export class LocalizedFontSize extends Component {
    @property({ type: LanguageFontSize })
    overrideSizes: LanguageFontSize[] = [];

    label: Label = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(Label);
        this.updateFont();
    }

    initData() {
        this.fontBases = {
            en: 16,
            zh_cn: 20,
            zh_tw: 20,
        };
    }

    updateFont() {
        const size = this.getFontSizeByLanguage();
        if (this.label) {
            this.label.fontSize = size;
        }
    }

    getFontSizeByLanguage(): any {
        const lang = Translator.getCurrentLanguageId();
        const overrideSize = this.overrideSizes.find((data) => data.language === lang);
        return overrideSize?.size || this.fontBases[lang] || this.fontBases["en"];
    }
}
