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
    private isCashedOutFull = false;
    private halfCashOutData = null;
    private readonly cashOutSound = "cash_out";

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    reset() {
        this.bet = 0;
        this.halfCashOutData = null;
        this.isCashedOutHalf = false;
        this.isCashedOutHalf = false;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    updateCashOutByMultiplier(multiplier: number) {
        if (!this.isCashedOutHalf && this.bet > 0) {
            const cashOutValue = (multiplier * this.bet) / 2;
            CashOutComponent.updateValueCashOut(cashOutValue, this.lblCashOut);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutBet, { fireImmediately: false })
    updateBetValue(cashOutBet: any) {
        if (cashOutBet && cashOutBet.value > 0) {
            this.bet = CashOutComponent.getBetValue(cashOutBet);
        }
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
        this.playSoundCashOut();
        this.closeAllPopups();
        this.handleCashOutState();
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutHalf)
    updateCashOutHalfButton(isCashedOut: boolean) {
        CashOutComponent.updateCashOutButtonStatus(isCashedOut, this.sprDisabled);
        this.isCashedOutHalf = isCashedOut;
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isCashedOutFull)
    checkCashOutFull(isCashedOutFull: boolean) {
        this.isCashedOutFull = isCashedOutFull;
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOut, { fireImmediately: false })
    updateValueCashOut(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        this.halfCashOutData = halfCashOut;
        CashOutComponent.updateValueCashOut(halfCashOut?.cashOutWin, this.lblCashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, {
        fireImmediately: false,
    })
    updateValueWhenCashOutFull(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        if (cashOut) {
            if (this.isCashedOutFull && !this.halfCashOutData && cashOut && cashOut.cashOutWin > 0) {
                CashOutComponent.updateValueCashOut(cashOut.cashOutWin / 2, this.lblCashOut);
            }
        }
    }

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateStatusCashOutHalfButton(isCrashed: boolean) {
        CashOutComponent.updateCashOutButtonStatus(isCrashed, this.sprDisabled);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCashOut() {
        return this.cashOutSound;
    }
}
