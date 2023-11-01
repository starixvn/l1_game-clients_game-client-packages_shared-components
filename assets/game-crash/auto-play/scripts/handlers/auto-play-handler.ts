import gc from "@sg/game-client-base";
import inversify from "inversify";

import { AutoPlayStore } from "../stores/auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    handle() {}

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
    }

    checkAutoPlayClick() {
        if (!this.autoPlayStore.isAutoPlay) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
        } else {
            this.autoPlayStore.isAutoPlay = false;
            this.autoPlayStore.roundsAutoPlay = 0;
        }
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoPlayStore.isAutoPlay = true;
        this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup;
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    decreaseAutoPlayRounds() {
        if (this.autoPlayStore.isAutoPlay) {
            this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
        }
    }

    private updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoPlay = rounds;
    }

    checkFinishedPlayMode() {
        if (this.autoPlayStore.roundsAutoPlay === 0 && this.autoPlayStore.isAutoPlay) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
            this.autoPlayStore.isAutoPlay = false;
        }
    }
}
