import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
import { CASH_OUT_STATE, PlayerActionStore } from "../player-actions/player-action-store";
import { PopupsHandlers } from "../popups/popups-handlers";
import { CashOutComponent } from "./cash-out-component";
import { AutoPlayHandler } from "../auto-play/scripts/handlers/auto-play-handler";

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

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutFull)
    updateCashOutFullButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOut = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOut) {
            let cashOutValue = multiplier * this.bet;
            this.lblCashOut.string = FormatUtils.numberWithCommas(cashOutValue, 2);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashoutBet)
    updateBetValue(cashoutBet: any) {
        this.bet = CashOutComponent.getBetValue(cashoutBet);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    assignCashoutBetValue(lastReceivedBet: any) {
        this.updateCashoutBetValue(lastReceivedBet);
    }
    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutBetValue: number) =>
        cashOutHandler.updateCashoutBetValue(cashOutBetValue)
    )
    updateCashoutBetValue(lastReceivedBet: any) {
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
        setTimeout(() => {
            this.handleUICashOutState(CASH_OUT_STATE.FULL);
        }, 3000);
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }
    
    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOut, { fireImmediately: false })
    updateValueCashOut(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashout) {
        CashOutComponent.updateValueCashOut(cashOut?.win, this.lblCashOut);
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashoutButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButton(isCrashed, this.sprDisabled);
    }
}
