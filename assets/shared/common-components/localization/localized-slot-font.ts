import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedSlotFont")
export class LocalizedSlotFont extends LocalizedFont {
    initData() {
        const kodchasanRegularFont = "kodchasan-regular";
        this.fontBases = {
            vi: {
                name: kodchasanRegularFont,
                loadRemote: false,
            },
            id: {
                name: kodchasanRegularFont,
                loadRemote: false,
            },
            en: {
                name: kodchasanRegularFont,
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
        } as FontMapping;
    }
}
