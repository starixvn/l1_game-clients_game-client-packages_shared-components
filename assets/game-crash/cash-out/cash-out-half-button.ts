// Compare this snippet from assets/game/scripts/components/cash-out/cash-out-half-button.ts:
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
export class CashOutHalfButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Sprite)
    sprDisabled: Sprite = null;

    private bet = 0;
    private isCashedOutHalf = false;

    private halfCashOutData = null;

    private cashOutData = null;

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutHalf)
    updateCashOutHalfButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButton(isCashedOut, this.sprDisabled);
        this.isCashedOutHalf = isCashedOut;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOut(multiplier: number) {
        if (!this.isCashedOutHalf) {
            const cashOutValue = (multiplier * this.bet) / 2;
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

    @handle(PlayerActionHandlers, (handle, action: string) => handle.handleCurrentCashOutStateInStore(action))
    handleCashOutState() {
        return CASH_OUT_STATE.HALF;
    }

    @render(PlayerActionStore, (store) => store.visibleCashOut)
    updateCashOutButtonStatus(visibleCashOut: boolean) {
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

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOut, { fireImmediately: false })
    updateValueCashOut(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        this.halfCashOutData = halfCashOut;
        CashOutComponent.updateValueCashOut(halfCashOut?.cashOutWin, this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, { fireImmediately: false })
    assignCashOutData(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        this.cashOutData = cashOut;
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashOutHalfButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButton(isCrashed, this.sprDisabled);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutFull)
    updateValueHalfButton(isCashedOutFull: boolean) {
        if (isCashedOutFull && !this.halfCashOutData) {
            CashOutComponent.updateValueCashOut(this.cashOutData?.cashOutWin / 2, this.lblCashOut);
        }
    }
}
