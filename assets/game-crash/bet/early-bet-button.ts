import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { BetInputStore } from "./../bet-input/scripts/stores/bet-input-store";

import AutoCashOutStore from "../../../../../extensions/shared-components/assets/game-crash/auto-cash-out/scripts/stores/auto-cash-out-store";
import { AutoPlayHandler } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/handlers/auto-play-handler";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { EARLY_BET_STATE, PlayerActionStore } from "../player-actions/player-action-store";
import { PopupsHandlers } from "../popups/popups-handlers";
import { EarlyBetStore } from "./early-bet-store";
import { EarlyBetUIHandlers } from "./early-bet-ui-handlers";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Rounds, Translator } = gc;

@ccclass
export default class EarlyBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    sprPlaceBet: Sprite = null;

    @property(Sprite)
    sprNextRound: Sprite = null;

    @property(Sprite)
    sprWaiting: Sprite = null;

    @property(Sprite)
    sprCancel: Sprite = null;

    private amount: number;

    private isWaitingBet = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    private isAutoPlayMode = false;

    private hasEarlyBetBeforeAutoPlay = false;

    private autoPlayWhenRocketFly = false;
    private readonly placeBetSound = "place_bet";
    private betAmountGreaterMinBet = false;
    private minBet = 0;

    @render(AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    updateStatusButton(isEarlyBet: boolean) {
        this.setStatusButtons(isEarlyBet);
        this.setStatusWaiting(isEarlyBet);
        this.handleEarlyStatusBetUI(isEarlyBet ? EARLY_BET_STATE.BET : EARLY_BET_STATE.NONE);
    }

    @handle(PlayerActionHandlers, (handle, action: string) => handle.handleCurrentEarlyBetStateInStore(action))
    handleEarlyStatusBetUI(action: string) {
        return action;
    }

    @render(EarlyBetStore, (store) => store.betAmount)
    updateAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    onClickEarlyBet() {
        if (!this.betAmountGreaterMinBet) {
            this.showMsgMinBet(this.minBet);
            this.cancelAutoPlay();
            return;
        }
        this.playSoundPlaceBet();
        this.closeAllPopups();
        if (this.isWaitingBet) {
            this.cancelAutoPlay();
        }
        return !this.isWaitingBet;
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(AutoPlayHandler, (handle, enable: boolean) => handle.cancelAutoPlay())
    cancelAutoPlay() {}

    @handle(EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    disableEarlyBet() {
        return false;
    }

    @handle(PlayerActionHandlers, (handle, flag: boolean) => handle.handleWaitingBet(flag))
    handleWaitingBet(flag: boolean) {
        return flag;
    }

    @handle(PlayerActionHandlers, (handle, minBet: number) => handle.showMsgMinBet(minBet))
    showMsgMinBet(minBet: number) {
        return minBet;
    }

    @render(PlayerActionStore, (store) => store.visibleBetNextRound)
    showPlaceBetNextRound(visibleBetNextRound: boolean) {
        if (visibleBetNextRound) {
            this.handleRocketFly();
        } else {
            this.node.active = false;
        }
    }

    @render(BetInputStore, (store) => store.betAmountGreaterMinBet)
    checkBetAmountGreaterMinBet(betAmountGreaterMinBet: boolean) {
        this.betAmountGreaterMinBet = betAmountGreaterMinBet;
    }

    @render(PlayerActionStore, (store) => store.visibleCashOut)
    cancelEarlyBet(visibleCashOut: boolean) {
        if (visibleCashOut) {
            this.disableEarlyBet();
        }
    }

    @handle(PlayerActionHandlers, (handle, action: string) => handle.handleCurrentBetStateInStore(action))
    handleBetUIControl(action: string) {
        return action;
    }

    handleRocketFly() {
        this.node.active = true;
        this.setStatusButtons(false);
        this.setStatusWaiting(false);
        this.disableEarlyBet();
        setTimeout(() => {
            this.autoClickEarlyBet();
        }, 100);
    }

    @handle(GameCrash.CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    autoPlaceBet() {
        this.setStatusWaiting(false);
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    setStatusButtons(selected: boolean) {
        this.bgWaiting.node.active = this.sprWaiting.node.active = this.sprCancel.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = this.sprNextRound.node.active = !selected;
    }

    setStatusWaiting(status: boolean) {
        this.isWaitingBet = status;
        this.handleWaitingBet(status);
    }

    @render(Rounds.RoundTimeStore, (store) => ({
        isPlacingBet: store.isPlacingBet,
    }))
    acceptedEarlyBet(data: { isPlacingBet: boolean }) {
        const { isPlacingBet } = data;
        if (isPlacingBet) {
            this.node.active = false;
            if (this.hasEarlyBetBeforeAutoPlay) {
                this.handleEarlyBetBeforeAutoPlay(false);
            }
            if (this.isWaitingBet) {
                this.autoPlaceBet();
            }
            if (this.autoPlayWhenRocketFly) {
                this.disableAutoPlayWhenRocketFly();
            }
        }
    }

    @render(AutoPlayStore, (store) => store.autoPlayWhenRocketFly)
    updateAutoPlayWhenRocketFly(value: boolean) {
        this.autoPlayWhenRocketFly = value;
    }

    autoClickEarlyBet() {
        if (this.isAutoPlayMode) {
            this.onClickEarlyBet();
            this.decreaseAutoPlayRounds();
            this.handleAutoPlayStatus();
            this.handleEarlyBetBeforeAutoPlay(true);
        }
    }

    @render(AutoPlayStore, (store) => store.autoPlayWhenRocketFly)
    checkAutoPlayWhenPlacingBet(autoPlayWhenRocketFly: boolean) {
        if (autoPlayWhenRocketFly) {
            this.onClickEarlyBet();
            this.handleEarlyBetBeforeAutoPlay(true);
        }
    }

    @render(PlayerActionStore, (store) => store.autoEarlyBet)
    updateAutoPlayMode(autoEarlyBet: boolean) {
        this.isAutoPlayMode = autoEarlyBet;
    }

    @handle(PlayerActionHandlers, (handle) => handle.handleActiveAutoPlayInStore(true))
    handleAutoPlayStatus() {}

    @handle(AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    decreaseAutoPlayRounds() {}

    @handle(AutoPlayHandler, (handle) => handle.updatedAutoPlayWhenRocketFly(false))
    disableAutoPlayWhenRocketFly() {}

    @handle(AutoPlayHandler, (handle, flag: boolean) => handle.checkEarlyBetBeforeAutoPlay(flag))
    handleEarlyBetBeforeAutoPlay(flag: boolean) {
        return flag;
    }

    @render(AutoPlayStore, (store) => store.hasEarlyBetBeforeAutoPlay)
    updateHasEarlyBetBeforeAutoPlay(value: boolean) {
        this.hasEarlyBetBeforeAutoPlay = value;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundPlaceBet() {
        return this.placeBetSound;
    }

    @render(BetInputStore, (store) => store.minBet)
    setMinBet(minBet: number) {
        this.minBet = minBet;
    }
}
