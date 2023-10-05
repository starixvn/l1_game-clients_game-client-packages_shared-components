import gc from "@sg/game-client-base";
import inversify from "inversify";

import { AutoPlayStore } from "../stores/auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;

    handle() {}

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
    }

    checkAutoPlayClick() {
        if (!this.autoPlayStore.isAutoPlay) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
        } else {
            this.autoPlayStore.isAutoPlay = false;
            this.autoPlayStore.autoPlayRounds = 0;
        }
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoPlayStore.isAutoPlay = true;
        this.autoPlayStore.autoPlayRounds = this.autoPlayStore.selectedRoundOnPopup;
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    decreaseAutoPlayRounds() {
        this.updateAutoPlayRounds(this.autoPlayStore.autoPlayRounds - 1);
    }

    private updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.autoPlayRounds = rounds;
        if (this.autoPlayStore.autoPlayRounds < 0) {
            this.autoPlayStore.isAutoPlay = false;
        }
    }
}
