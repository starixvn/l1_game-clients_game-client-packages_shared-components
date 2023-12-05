import gc from "@sg/game-client-base";
import inversify from "inversify";

import { BetInputStore } from "../../../bet-input/scripts/stores/bet-input-store";
import { EarlyBetStore } from "../../../bet/early-bet-store";
import { AutoPlayStore } from "../stores/auto-play-store";
import { PlayerActionStore } from "../../../player-actions/player-action-store";

const { injectable, inject } = inversify;
const { Translator } = gc;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore;
    @inject(BetInputStore) private readonly betInputStore: BetInputStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(gc.Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Notices.NoticeStore) private readonly noticeStore: gc.Notices.NoticeStore;
    @inject(PlayerActionStore) private readonly playerActionStore: PlayerActionStore;

    handle() {}

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
    }

    checkAutoPlayClick() {
        if (!this.autoPlayStore.isAutoPlay && this.checkBalanceForAutoPlay()) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
        } else {
            this.autoPlayStore.isAutoPlay = false;
            this.autoPlayStore.roundsAutoPlay = 0;
        }
    }

    private checkBalanceForAutoPlay() {
        const { freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
        if (this.betInputStore.betAmount <= availableBalance) {
            return true;
        } else {
            this.noticeStore.addWarning(Translator.commonTranslate("not_enough_money"));
            return false;
        }
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoPlayStore.autoPlayWhenRocketFly = false;
        this.autoPlayStore.autoPlayWhenPlacingBet = false;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoPlayStore.isAutoPlay = true;
        this.updateStatusLatestRoundAccepted();
        if (!this.playerActionStore.visibleCashOut && this.playerActionStore.visibleBetNextRound && !this.earlyBetStore.earlyBet) {
            this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.selectedRoundOnPopup - 1;
            this.autoPlayStore.autoPlayWhenRocketFly = true;
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
            if (this.checkBalanceForAutoPlay() && this.autoPlayStore.roundsAutoPlay > 0) {
                this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
            } else {
                this.autoPlayStore.isAutoPlay = false;
            }
        }
    }

    private updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoPlay = rounds;
    }

    checkFinishedPlayMode() {
        if (this.autoPlayStore.roundsAutoPlay === 0 && this.autoPlayStore.isAutoPlay && !this.autoPlayStore.hasEarlyBetBeforeAutoPlay) {
            this.autoPlayStore.isOpenAutoPlayPopup = true;
            this.autoPlayStore.isAutoPlay = false;
        }
    }

    cancelAutoPlay() {
        this.autoPlayStore.roundsAutoPlay = 0;
        this.autoPlayStore.isAutoPlay = false;
        this.autoPlayStore.autoPlayWhenRocketFly = false;
        this.autoPlayStore.autoPlayWhenPlacingBet = false;
    }

    checkEarlyBetBeforeAutoPlay(value: boolean) {
        this.autoPlayStore.hasEarlyBetBeforeAutoPlay = value;
    }

    updatedAutoPlayWhenPlacingBet(value: boolean) {
        this.autoPlayStore.autoPlayWhenPlacingBet = value;
    }

    updatedAutoPlayWhenRocketFly(value: boolean) {
        this.autoPlayStore.autoPlayWhenRocketFly = value;
    }

    updateStatusLatestRoundAccepted() {
        this.autoPlayStore.latestRoundAccepted = this.autoPlayStore.roundsAutoPlay === 0;
    }
}
