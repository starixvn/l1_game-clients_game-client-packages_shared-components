import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedSlotFontBold")
export default class LocalizedSlotFontBold extends LocalizedFont {
    initData() {
        const kodchasanBoldFont = "kodchasan-bold";
        this.fontBases = {
            vi: {
                name: kodchasanBoldFont,
                loadRemote: false,
            },
            id: {
                name: kodchasanBoldFont,
                loadRemote: false,
            },
            en: {
                name: kodchasanBoldFont,
                loadRemote: false,
            },
            th: {
                name: "noto-serif-bold-thai",
                loadRemote: false,
            },
            zh_cn: {
                name: "noto-serif-bold-zhcn",
                loadRemote: false,
            },
            zh_tw: {
                name: "noto-serif-bold-zhtw",
                loadRemote: false,
            },
            ...globalThis?.fontMapping?.slotBold,
        } as FontMapping;
    }
}
