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

    // @render(Bet.BetStore, (store) => store.lastReceivedBet)
    // assignCashOutBetValue(lastReceivedBet: any) {
    //     this.updateCashOutBetValue(lastReceivedBet);
    // }

    // @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutBetValue: number) =>
    //     cashOutHandler.updateCashOutBetValue(cashOutBetValue)
    // )
    // updateCashOutBetValue(lastReceivedBet: any) {
    //     return CashOutComponent.getBetValue(lastReceivedBet);
    // }

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
        return CashOutComponent.getCashOutValue(this.lblCashOut);
    }

    @handle(GameCrash.Popups.PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCashOut() {
        return this.cashOutSound;
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledHalfCashOut)
    disabledFullCashOut(disabledHalfCashOut: boolean) {
        this.sprDisabled.node.active = disabledHalfCashOut;
    }
}
