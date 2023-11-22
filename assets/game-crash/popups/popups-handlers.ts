import { _decorator } from "cc";
import inversify from "inversify";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game-crash/bet-input/scripts/stores/bet-input-store";
import { Md5PopupStore } from "../../../../../extensions/shared-components/assets/game-crash/md5-popup/scripts/stores/md5-popup-store";
import AutoCashOutPopupStore from "../auto-cash-out/scripts/stores/auto-cash-out-popup-store";
import { PopupsGameStore } from "./popups-game-store";
const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class PopupsHandlers {
    @inject(Md5PopupStore) private readonly md5PopupStore: Md5PopupStore;
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;
    @inject(BetInputStore) private readonly betInputStore: BetInputStore;
    @inject(AutoCashOutPopupStore) private readonly autoCashOutStore: AutoCashOutPopupStore;
    @inject(PopupsGameStore) private readonly overlayPopupStore: PopupsGameStore;

    closeOtherPopupsWithoutMd5() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutAutoPlay() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutBetInput() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutAutoCashOut() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeAllPopups() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = false;
    }
}
