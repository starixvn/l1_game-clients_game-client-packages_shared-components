import { _decorator } from "cc";
import { FontMapping, LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedSlotFontBold")
export default class LocalizedSlotFontBold extends LocalizedFont {
    initData() {
        const kodchasanBoldFont = "kodchasan-bold";
        this.fontBases = {
            vi: kodchasanBoldFont,
            id: kodchasanBoldFont,
            en: kodchasanBoldFont,
            th: "noto-serif-bold-thai",
            zh_cn: "noto-serif-bold-zhcn",
            zh_tw: "noto-serif-bold-zhtw",
        } as FontMapping;
    }
}
