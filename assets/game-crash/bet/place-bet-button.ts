import gc from "@sg/game-client-base";
import { _decorator, Node, Sprite } from "cc";
import Observer from "observer";

import AutoCashOutHandler from "../../../../../extensions/shared-components/assets/game-crash/auto-cash-out/scripts/handlers/auto-cash-out-handler";
import AutoCashOutStore from "../../../../../extensions/shared-components/assets/game-crash/auto-cash-out/scripts/stores/auto-cash-out-store";
import { AutoPlayHandler } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/handlers/auto-play-handler";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game-crash/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { BET_STATE, PlayerActionStore } from "../player-actions/player-action-store";
import { PopupsHandlers } from "../popups/popups-handlers";
import { EarlyBetStore } from "./early-bet-store";
import { Md5PopupHandler } from "../md5-popup/scripts/handlers/md5-popup-handlers";
import AutoCashOutPopupHandler from "../auto-cash-out/scripts/handlers/auto-cash-out-popup-handler";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, Rounds } = gc;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    bgDisable: Sprite = null;

    @property(Sprite)
    sprPlaceBet: Sprite = null;

    @property(Sprite)
    sprBetAccepted: Sprite = null;

    @property(Node)
    placeBetNotice: Node = null;

    private amount: number;

    private isBetAccepted = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 1.01;

    private earlyBet = false;

    private hasEarlyBetBeforeAutoPlay = false;

    private placeBetSound = "place_bet";

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    enableEarlyBet(enable: boolean) {
        this.earlyBet = enable;
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    updateStatusPlaceBet(lastReceivedBet: any) {
        if (!lastReceivedBet || lastReceivedBet.value <= 0 || lastReceivedBet.value !== this.amount) {
            return;
        }

        this.setStatusBet(true);
        this.isBetAccepted = true;
        this.placeBetNotice.active = true;
        this.disableAutoCashout(true);
        this.checkStatusLatestRound();
        this.hideAutoPlayPopup();
        this.hideMD5Popup();
        this.hideAutoCashOutPopup();
        setTimeout(() => {
            this.placeBetNotice.active = false;
        }, 3000);
    }

    @handle(AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    hideAutoPlayPopup() {}

    @handle(Md5PopupHandler, (handle, value: boolean) => handle.updateShowHidePopupMd5(value))
    hideMD5Popup() {
        return false;
    }

    @handle(AutoCashOutPopupHandler, (handle) => handle.togglePopup(false))
    hideAutoCashOutPopup() {}

    @handle(AutoPlayHandler, (handle) => handle.updateStatusLatestRoundAccepted())
    checkStatusLatestRound() {}

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    setBetStatus(isReceivedBet: boolean) {
        this.handleBetUIControl(isReceivedBet ? BET_STATE.BET : BET_STATE.NONE);
    }

    @handle(PlayerActionHandlers, (handle, action: string) => handle.handleCurrentBetStateInStore(action))
    handleBetUIControl(action: string) {
        return action;
    }

    @handle(AutoCashOutHandler, (handle, disable: boolean) => handle.handleDisableAuto(disable))
    disableAutoCashout(disable: boolean) {
        return disable;
    }

    @render(AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(AutoCashOutStore, (store) => store.multiplier)
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }

    onClickPlaceBet() {
        this.playSoundPlaceBet();
        this.closeAllPopups();
        if (!this.isBetAccepted && !this.bgDisable.node.active) {
            this.sendBetRequest();
        }
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(GameCrash.CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    sendBetRequest() {
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    @render(PlayerActionStore, (store) => store.isFlyingTime)
    renderLiveGame(isFlyingTime: boolean) {
        if (isFlyingTime) {
            this.isBetAccepted = false;
            this.node.active = false;
            this.setStatusBet(false);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    renderPlacingBet(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.node.active = true;
            if (this.earlyBet || this.isBetAccepted) {
                this.isBetAccepted = true;
                this.setStatusBet(true);
            } else {
                this.setStatusBet(false);
                this.enableAutoCashOut();
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    renderLockBet(isLocking: boolean) {
        if (isLocking && !this.isBetAccepted) {
            this.node.active = true;
            this.disablePlaceBetButton(true);
        }
    }

    setStatusBet(selected: boolean) {
        this.bgWaiting.node.active = this.sprBetAccepted.node.active = selected;
        this.sprPlaceBet.node.active = this.bgPlaceBet.node.active = !selected;
        this.disablePlaceBetButton(selected);
    }

    @handle(AutoCashOutHandler, (handle) => handle.handleDisableAuto(false))
    enableAutoCashOut() {}

    disablePlaceBetButton(disable: boolean) {
        this.bgDisable.node.active = disable;
    }

    @render(PlayerActionStore, (store) => store.activeAutoPlayCurrentRound)
    effectAutoPlayInCurrentRound(activeAutoPlayCurrentRound: boolean) {
        if (activeAutoPlayCurrentRound && !this.hasEarlyBetBeforeAutoPlay && !this.isBetAccepted) {
            this.disabledAutoPlayWhenPlacingBet();
            this.onClickPlaceBet();
            this.decreaseAutoPlayRounds();
        }
    }

    @render(AutoPlayStore, (store) => store.hasEarlyBetBeforeAutoPlay)
    updateHasEarlyBetBeforeAutoPlay(value: boolean) {
        this.hasEarlyBetBeforeAutoPlay = value;
    }

    @handle(AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    decreaseAutoPlayRounds() {}

    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    disableAutoPlay(isLocking: boolean) {
        if (isLocking) {
            this.handleAutoPlayStatus();
        }
    }

    @handle(PlayerActionHandlers, (handle) => handle.handleActiveAutoPlayInStore(false))
    handleAutoPlayStatus() {}

    @handle(AutoPlayHandler, (handle, value: boolean) => handle.updatedAutoPlayWhenPlacingBet(value))
    disabledAutoPlayWhenPlacingBet() {
        return false;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundPlaceBet() {
        return this.placeBetSound;
    }
}
