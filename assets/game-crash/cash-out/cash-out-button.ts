import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { CashOutComponent } from "./cash-out-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, FormatUtils } = gc;

@ccclass
export class CashOutButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOut = false;

    private readonly cashOutSound = "cash_out";

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutFull)
    updateCashOutFullButton(isCashedOut: boolean) {
        isCashedOut &&
            setTimeout(() => {
                this.handleUICashOutState(GameCrash.CASH_OUT_STATE.FULL);
            }, 3000);
        CashOutComponent.updateCashOutButtonStatus(isCashedOut, this.sprDisabled);
        this.isCashedOut = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut && this.bet > 0) {
            const cashOutValue = multiplier * this.bet;
            this.lblCashOut.string = FormatUtils.numberWithCommas(cashOutValue, 2);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutBet)
    updateBetValue(cashOutBet: any) {
        this.bet = CashOutComponent.getBetValue(cashOutBet);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    assignCashOutBetValue(lastReceivedBet: any) {
        this.updateCashOutBetValue(lastReceivedBet);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutBetValue: number) =>
        cashOutHandler.updateCashOutBetValue(cashOutBetValue)
    )
    updateCashOutBetValue(lastReceivedBet: any) {
        return CashOutComponent.getBetValue(lastReceivedBet);
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, action: string) => handle.handleCurrentCashOutStateInStore(action))
    handleUICashOutState(action: string) {
        return action;
    }

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    setBetStatus(isReceivedBet: boolean) {
        !isReceivedBet && this.handleUICashOutState(GameCrash.CASH_OUT_STATE.NONE);
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleCashOut)
    updateCashoutButtonStatus(visibleCashOut: boolean) {
        CashOutComponent.showHideNode(this.node, visibleCashOut);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, false)
    )
    onClickCashOut() {
        this.playSoundCashOut();
        this.closeAllPopups();
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, { fireImmediately: false })
    updateValueCashOut(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        if (!cashOut?.cashOutWin) {
            return;
        }
        CashOutComponent.updateValueCashOut(cashOut?.cashOutWin, this.lblCashOut);
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashOutButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButtonStatus(isCrashed, this.sprDisabled);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCashOut() {
        return this.cashOutSound;
    }
}
