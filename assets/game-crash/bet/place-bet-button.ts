import gc from "@sg/game-client-base";
import { _decorator, Node, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, Rounds } = gc;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Sprite)
    bgAcceptedBet: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    bgDisable: Sprite = null;

    @property(Node)
    placeBetNotice: Node = null;

    private amount: number;

    private isBetAccepted = false;

    private isEnableAutoCashOut = false;

    private valueAutoCashOut = 0;

    private isClickPlaceBet = false;

    private readonly placeBetSound = "place_bet";
    onLoad(): void {
        super.onLoad();
        this.placeBetNotice.active = false;
    }

    @render(GameCrash.BetInput.BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    updateBetAccepted(isStartRound: boolean) {
        isStartRound && (this.isBetAccepted = false);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    updateStatusPlaceBet(lastReceivedBet: any) {
        const isReceivedBet = lastReceivedBet.value > 0;
        if (!isReceivedBet) {
            this.isBetAccepted = false;
            return;
        }

        this.isBetAccepted = true;
        this.isClickPlaceBet && (this.placeBetNotice.active = true);
        this.checkStatusLatestRound();
        this.hideAutoPlayPopup();
        this.hideMD5Popup();
        this.hideAutoCashOutPopup();
        setTimeout(() => {
            this.placeBetNotice.active = false;
            this.isClickPlaceBet = false;
        }, 3000);
    }

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    hideAutoPlayPopup() {}

    @handle(GameCrash.Md5Popup.Md5PopupHandler, (handle, value: boolean) => handle.setDisplayPopupMd5(value))
    hideMD5Popup() {
        return false;
    }

    @handle(GameCrash.AutoCashOut.AutoCashOutPopupHandler, (handle) => handle.togglePopup(false))
    hideAutoCashOutPopup() {}

    @handle(GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.updateStatusLatestRoundAccepted())
    checkStatusLatestRound() {}

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, action: string) => handle.handleCurrentBetStateInStore(action))
    handleBetUIControl(action: string) {
        return action;
    }

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.enable)
    updateStatusAutoCashOut(isEnable: boolean) {
        this.isEnableAutoCashOut = isEnable;
    }

    @render(GameCrash.AutoCashOut.AutoCashOutStore, (store) => store.multiplier, { fireImmediately: false })
    updateValueAutoCashOut(value: number) {
        this.valueAutoCashOut = value;
    }

    onClickPlaceBet() {
        this.playSoundPlaceBet();
        this.closeAllPopups();
        this.isClickPlaceBet = true;
        if (!this.isBetAccepted && !this.bgDisable.node.active) {
            this.sendBetRequest();
        }
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(GameCrash.CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    sendBetRequest() {
        return { autoCashOut: this.isEnableAutoCashOut ? this.valueAutoCashOut : undefined, amount: this.amount };
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState)
    private setBetButtonVisibility(buttonState: string) {
        const isPlaceBet = buttonState === GameCrash.ButtonState.PLACE_BET;
        const isAcceptedBet = buttonState === GameCrash.ButtonState.BET_ACCEPTED;
        this.node.active = isPlaceBet || isAcceptedBet;
        this.handlePlaceBetButton(isPlaceBet);
        this.handleAcceptedBetButton(isAcceptedBet);
    }

    handlePlaceBetButton(isPlaceBet: boolean) {
        this.showPlaceBetButton(isPlaceBet);
        isPlaceBet && this.showDisabledPlayer(false);
    }

    handleAcceptedBetButton(isAcceptedBet: boolean) {
        this.showAcceptedBetButton(isAcceptedBet);
        isAcceptedBet && this.showDisabledPlayer(true);
    }

    showPlaceBetButton(status: boolean) {
        this.bgPlaceBet.node.active = status;
    }

    showAcceptedBetButton(status: boolean) {
        this.bgAcceptedBet.node.active = status;
    }

    @render(Rounds.RoundTimeStore, (store) => ({ isLocking: store.isLocking, roundTime: store.roundTime }))
    renderLockBet({ isLocking, roundTime }) {
        if (isLocking && roundTime >= 0) {
            this.showDisabledPlayer(true);
        }
    }

    showDisabledPlayer(disable: boolean) {
        this.bgDisable.node.active = disable;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundPlaceBet() {
        return this.placeBetSound;
    }
}
