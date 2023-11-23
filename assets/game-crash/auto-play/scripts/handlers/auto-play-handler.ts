import gc from "@sg/game-client-base";
import inversify from "inversify";

import { EarlyBetStore } from "../../../bet/early-bet-store";
import { AutoPlayStore } from "../stores/auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

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
        if ((this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking) && !this.betStore.isReceivedBet) {
            this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup - 1;
        } else {
            this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup;
        }
        if (this.earlyBetStore.earlyBet) {
            this.checkEarlyBetBeforeAutoPlay(true);
        }
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

    cancelAutoPlay() {
        this.autoPlayStore.roundsAutoPlay = 0;
        this.autoPlayStore.isAutoPlay = false;
    }

    checkEarlyBetBeforeAutoPlay(value: boolean) {
        this.autoPlayStore.hasEarlyBetBeforeAutoPlay = value;
    }
}
