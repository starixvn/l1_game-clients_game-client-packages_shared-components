import { _decorator } from "cc";
import { LocalizedFont } from "./localized-font";

const { ccclass } = _decorator;

@ccclass("LocalizedFontBold")
export default class LocalizedFontBold extends LocalizedFont {
    initData() {
        this.fontBases = {
            vi: "noto-serif-bold",
            id: "noto-serif-bold",
            en: "noto-serif-bold",
            th: "noto-serif-bold-thai",
            "zh_cn": "noto-serif-bold-zhcn",
            "zh_tw": "noto-serif-bold-zhtw",
        };
    }
}
