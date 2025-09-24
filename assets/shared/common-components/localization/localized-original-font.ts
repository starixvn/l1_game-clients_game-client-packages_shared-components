import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedOriginalFont")
export class LocalizedOriginalFont extends LocalizedFont {
    initData() {
        const interRegularFont = "Inter-Regular";
        this.fontBases = {
            vi: {
                name: interRegularFont,
                loadRemote: false,
            },
            id: {
                name: interRegularFont,
                loadRemote: false,
            },
            en: {
                name: interRegularFont,
                loadRemote: false,
            },
            th: {
                name: interRegularFont,
                loadRemote: false,
            },
            zh_cn: {
                name: interRegularFont,
                loadRemote: false,
            },
            zh_tw: {
                name: interRegularFont,
                loadRemote: false,
            },
            hi_in: {
                name: "NotoSans-Medium",
                loadRemote: false,
            },
            bn_bd: {
                name: "HindSiliguri-Medium",
                loadRemote: false,
            },
            ...globalThis?.fontMapping?.originalRegular,
        } as FontMapping;
    }
}
