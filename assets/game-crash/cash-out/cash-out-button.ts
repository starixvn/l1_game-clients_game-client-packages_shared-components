import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { CASH_OUT_STATE, PlayerActionStore } from "../player-actions/player-action-store";
import { PopupsHandlers } from "../popups/popups-handlers";
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

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutFull)
    updateCashOutFullButton(isCashedOut: boolean) {
        isCashedOut &&
            setTimeout(() => {
                this.handleUICashOutState(CASH_OUT_STATE.FULL);
            }, 3000);
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOut = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut) {
            const cashOutValue = multiplier * this.bet;
            this.lblCashOut.string = FormatUtils.numberWithCommas(cashOutValue, 2);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutBet)
    updateBetValue(cashOutBet: any) {
        this.bet = CashOutComponent.getBetValue(cashOutBet);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    assignCashoutBetValue(lastReceivedBet: any) {
        this.updateCashOutBetValue(lastReceivedBet);
    }
    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutBetValue: number) =>
        cashOutHandler.updateCashOutBetValue(cashOutBetValue)
    )
    updateCashOutBetValue(lastReceivedBet: any) {
        return CashOutComponent.getBetValue(lastReceivedBet);
    }

    @handle(PlayerActionHandlers, (handle, action: string) => handle.handleCurrentCashOutStateInStore(action))
    handleUICashOutState(action: string) {
        return action;
    }

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    setBetStatus(isReceivedBet: boolean) {
        !isReceivedBet && this.handleUICashOutState(CASH_OUT_STATE.NONE);
    }

    @render(PlayerActionStore, (store) => store.visibleCashOut)
    updateCashoutButtonStatus(visibleCashOut: boolean) {
        CashOutComponent.showHideNode(this.node, visibleCashOut);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, false)
    )
    onClickCashOut() {
        this.closeAllPopups();
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, { fireImmediately: false })
    updateValueCashOut(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        CashOutComponent.updateValueCashOut(cashOut?.cashOutWin, this.lblCashOut);
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashOutButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButton(isCrashed, this.sprDisabled);
    }
}
