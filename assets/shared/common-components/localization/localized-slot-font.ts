import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedSlotFont")
export class LocalizedSlotFont extends LocalizedFont {
    initData() {
        const kodchasanRegularFont = "kodchasan-regular";
        this.fontBases = {
            vi: kodchasanRegularFont,
            id: kodchasanRegularFont,
            en: kodchasanRegularFont,
            th: "noto-serif-regular-thai",
            zh_cn: "noto-serif-regular-zhcn",
            zh_tw: "noto-serif-regular-zhtw",
        } as FontMapping;
    }
}
