import gc from "@sg/game-client-base";
import { Label, Sprite, SpriteAtlas, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

import { CrashUtils } from "../crash-utils";
import { Md5PopupHandler } from "../md5-popup/scripts/handlers/md5-popup-handlers";
import { CrashRoundHistory } from "./statistics-bar";
const { ccclass, property } = _decorator;
const { FormatUtils } = gc;
const { render, handle } = Observer;
@ccclass
export class StatisticsButton extends ObserverComponent {
    @property(Sprite)
    nodeBg: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    public roundInfo = null;
    private data: CrashRoundHistory = null;

    setMultiplier(data: number) {
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(+data, 2, false)}x`;
        CrashUtils.setSpriteFrameBg(+data, this.nodeBg, this.mainAtlas, "statistics-bar");
    }

    setData(data: CrashRoundHistory) {
        this.data = data;
    }

    @handle(
        Md5PopupHandler,
        (handle, info: { isCrashed: number; isOpenPopupMd5: boolean; data: CrashRoundHistory; isPopupCurrRound: boolean }) =>
            handle.handleMd5Popup(info)
    )
    onClickStatisticsButton() {
        return { isCrashed: 2, isOpenPopupMd5: true, data: this.data, isPopupCurrRound: false };
    }
}
