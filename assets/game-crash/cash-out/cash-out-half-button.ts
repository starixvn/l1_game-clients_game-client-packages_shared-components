// Compare this snippet from assets/game/scripts/components/cash-out/cash-out-half-button.ts:
import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { CASH_OUT_STATE, PlayerActionStore } from "../player-actions/player-action-store";
import { PopupsHandlers } from "../popups/popups-handlers";
import { CashOutComponent } from "./cash-out-component";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { GameCrash, Bet, FormatUtils } = gc;

@ccclass
export class CashOutHalfButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOutHalf = false;

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.isCashedOutHalf)
    updateCashOutHalfButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOutHalf = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOutHalf) {
            let cashOutValue = (multiplier * this.bet) / 2;
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
    handleCashOutState() {
        return CASH_OUT_STATE.HALF;
    }

    @render(PlayerActionStore, (store) => store.visibleCashOut)
    updateCashoutButtonStatus(visibleCashOut: boolean) {
        CashOutComponent.showHideNode(this.node, visibleCashOut);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, true)
    )
    onClickCashOutHalf() {
        this.closeAllPopups();
        this.handleCashOutState();
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.halfCashOut, { fireImmediately: false })
    updateValueCashOut(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashout) {
        CashOutComponent.updateValueCashOut(halfCashOut?.win, this.lblCashOut);
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashoutHalfButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButton(isCrashed, this.sprDisabled);
    }
}
