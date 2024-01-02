import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
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
    private readonly cashOutSound = "cash_out";

    onLoad() {
        super.onLoad();
        this.lblCashOut.string = "";
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOutValue, { fireImmediately: false })
    updateCashOutByMultiplier(halfCashOutValue: number) {
        if (halfCashOutValue > 0) {
            CashOutComponent.updateValueCashOut(halfCashOutValue, this.lblCashOut);
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

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, action: string) => handle.handleCurrentCashOutStateInStore(action))
    handleCashOutState() {
        return GameCrash.CASH_OUT_STATE.HALF;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleCashOut)
    updateCashOutButtonStatus(visibleCashOut: boolean) {
        CashOutComponent.setDisplayNode(this.node, visibleCashOut);
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

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.isHalfCashedOut)
    updateCashOutHalfButton(isHalfCashedOut: boolean) {
        CashOutComponent.updateCashOutButtonStatus(isHalfCashedOut, this.sprDisabled);
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
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
