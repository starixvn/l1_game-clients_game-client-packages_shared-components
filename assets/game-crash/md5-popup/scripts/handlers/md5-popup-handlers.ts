import inversify from "inversify";

import { Md5PopupStore } from "../stores/md5-popup-store";
const { injectable, inject } = inversify;

@injectable()
export class Md5PopupHandler {
    @inject(Md5PopupStore) private readonly md5PopupStore: Md5PopupStore;

    updateShowHidePopupMd5(isShow: boolean) {
        this.md5PopupStore.isOpenPopupMd5 = isShow;
    }

    handleMd5Popup(info: { isOpenPopupMd5: boolean; roundId: number }) {
        const { isOpenPopupMd5, roundId } = info;
        this.updateShowHidePopupMd5(isOpenPopupMd5);
        this.md5PopupStore.roundId = roundId;
    }

    quickChangeRoundIndex(isIncrease: boolean) {
        this.md5PopupStore.roundId = isIncrease ? this.md5PopupStore.roundId + 1 : this.md5PopupStore.roundId - 1;
    }
}
