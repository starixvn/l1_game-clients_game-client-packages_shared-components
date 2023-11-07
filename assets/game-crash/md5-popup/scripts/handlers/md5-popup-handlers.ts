import inversify from "inversify";

import { CrashRoundHistory } from "../../../statistics-bar/statistics-bar";
import { Md5PopupStore } from "../stores/md5-popup-store";
const { injectable, inject } = inversify;

@injectable()
export class Md5PopupHandler {
    @inject(Md5PopupStore) private readonly md5PopupStore: Md5PopupStore;

    handle() {}
    updateIsCrashedValue(isCrashed: number) {
        this.md5PopupStore.isCrashedGame = { value: isCrashed };
    }

    updateShowHidePopupMd5(isShow: boolean) {
        this.md5PopupStore.isOpenPopupMd5 = isShow;
    }

    handleMd5Popup(info: { isCrashed: number; isOpenPopupMd5: boolean; data: CrashRoundHistory }) {
        const { isCrashed, isOpenPopupMd5, data } = info;
        this.updateIsCrashedValue(isCrashed);
        this.updateShowHidePopupMd5(isOpenPopupMd5);
        this.md5PopupStore.roundHistoryData = data;
    }
}
