import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Rounds, Translator } = gc;

@ccclass
export default class EarlyBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

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

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.multiplier)
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }

    @render(GameCrash.CrashBet.EarlyBetStore, (store) => store.earlyBet)
    updateStatusButton(isEarlyBet: boolean) {
        this.setStatusButtons(isEarlyBet);
        this.setStatusWaiting(isEarlyBet);
        this.handleEarlyStatusBetUI(isEarlyBet ? GameCrash.EARLY_BET_STATE.BET : GameCrash.EARLY_BET_STATE.NONE);
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, action: string) => handle.handleCurrentEarlyBetStateInStore(action))
    handleEarlyStatusBetUI(action: string) {
        return action;
    }

    @render(GameCrash.CrashBet.EarlyBetStore, (store) => store.betAmount)
    updateAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @handle(GameCrash.CrashBet.EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    onClickEarlyBet() {
        if (!this.betAmountGreaterMinBet) {
            this.showMsgMinBet(this.minBet);
            this.cancelAutoPlay();
            return false;
        }
        this.playSoundPlaceBet();
        this.closeAllPopups();
        if (this.isWaitingBet) {
            this.cancelAutoPlay();
        }
        return !this.isWaitingBet;
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle, enable: boolean) => handle.cancelAutoPlay())
    cancelAutoPlay() {}

    @handle(GameCrash.CrashBet.EarlyBetUIHandlers, (handle, enable: boolean) => handle.handle(enable))
    disableEarlyBet() {
        return false;
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, flag: boolean) => handle.handleWaitingBet(flag))
    handleWaitingBet(flag: boolean) {
        return flag;
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, minBet: number) => handle.showMsgMinBet(minBet))
    showMsgMinBet(minBet: number) {
        return minBet;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleBetNextRound)
    showPlaceBetNextRound(visibleBetNextRound: boolean) {
        if (visibleBetNextRound) {
            this.handleRocketFly();
        } else {
            this.node.active = false;
        }
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.betAmountGreaterMinBet)
    checkBetAmountGreaterMinBet(betAmountGreaterMinBet: boolean) {
        this.betAmountGreaterMinBet = betAmountGreaterMinBet;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleCashOut)
    cancelEarlyBet(visibleCashOut: boolean) {
        if (visibleCashOut) {
            this.disableEarlyBet();
        }
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, action: string) => handle.handleCurrentBetStateInStore(action))
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
        this.bgWaiting.node.active = selected;
        this.bgPlaceBet.node.active = !selected;
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

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.autoPlayWhenRocketFly)
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

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.autoPlayWhenRocketFly)
    checkAutoPlayWhenPlacingBet(autoPlayWhenRocketFly: boolean) {
        if (autoPlayWhenRocketFly) {
            this.onClickEarlyBet();
            this.handleEarlyBetBeforeAutoPlay(true);
        }
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.autoEarlyBet)
    updateAutoPlayMode(autoEarlyBet: boolean) {
        this.isAutoPlayMode = autoEarlyBet;
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle) => handle.handleActiveAutoPlayInStore(true))
    handleAutoPlayStatus() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    decreaseAutoPlayRounds() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.updatedAutoPlayWhenRocketFly(false))
    disableAutoPlayWhenRocketFly() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle, flag: boolean) => handle.checkEarlyBetBeforeAutoPlay(flag))
    handleEarlyBetBeforeAutoPlay(flag: boolean) {
        return flag;
    }

    @render(GameCrash.AutoPlay.AutoPlayStore, (store) => store.hasEarlyBetBeforeAutoPlay)
    updateHasEarlyBetBeforeAutoPlay(value: boolean) {
        this.hasEarlyBetBeforeAutoPlay = value;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundPlaceBet() {
        return this.placeBetSound;
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.minBet)
    setMinBet(minBet: number) {
        this.minBet = minBet;
    }
}
