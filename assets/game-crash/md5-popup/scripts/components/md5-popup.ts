import { _decorator, Label, RichText } from "cc";
import Observer from "observer";
import { CrashRoundHistory } from "../../../../../../../assets/game/scripts/components/statistics-bar/statistics-bar";
import { Md5PopupHandler } from "../handlers/md5-popup-handlers";
import { Md5PopupStore } from "../stores/md5-popup-store";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class Md5Popup extends ObserverComponent {
    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblRoundId: Label = null;

    @property(RichText)
    lblMd5Key: RichText = null;

    @property(RichText)
    lblResult: RichText = null;

    public round: CrashRoundHistory = null;

    onLoad() {
        super.onLoad();
    }

    @render(Md5PopupStore, (store) => store.isCrashedGame)
    updateMd5Result(isCrashedGame: any) {
        if (isCrashedGame) {
            const value = isCrashedGame.value === 2 ? this.round.md5Result.rawValue : "";
            this.lblResult.string = value;
            this.updateMultiplier(isCrashedGame.value);
        }
    }

    @render(Md5PopupStore, (store) => store.isOpenPopupMd5)
    showHidePopupMd5(isOpenPopupMd5: boolean) {
        if (isOpenPopupMd5) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    @render(Md5PopupStore, (store) => store.roundHistoryData)
    bindDataMd5(roundHistoryData: CrashRoundHistory) {
        if (roundHistoryData) {
            this.updateInfo(roundHistoryData);
        }
    }

    updateInfo(roundHistoryData: CrashRoundHistory) {
        this.lblMd5Key.string = `<color=#4920a4>${roundHistoryData.md5Result.hashValue}</color>`;
        this.lblRoundId.string = `#${roundHistoryData.roundId.toString()}`;
        this.lblResult.string = `<color=#4920a4>${roundHistoryData.md5Result.rawValue}</color>`;
        this.lblMultiplier.string = `${roundHistoryData.result.toString()}x`;
    }

    updateMultiplier(isCrashedValue: number) {
        if (isCrashedValue === 0) {
            this.lblMultiplier.string = "5s";
        } else if (isCrashedValue === 1) {
            this.lblMultiplier.string = "In play";
        } else {
            //this.lblMultiplier.string = this.round.result.toString();
        }
    }

    @handle(Md5PopupHandler, (handle, value: boolean) => handle.updateShowHidePopupMd5(value))
    onClickCloseButton() {
        return false;
    }
}
