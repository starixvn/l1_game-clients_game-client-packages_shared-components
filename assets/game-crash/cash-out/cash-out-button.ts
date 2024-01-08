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

    private readonly cashOutSound = "cash_out";

    onLoad() {
        super.onLoad();
        this.lblCashOut.string = "";
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.fullCashOutValue, { fireImmediately: false })
    updateCashOut(fullCashOutValue: number) {
        if (fullCashOutValue > 0) {
            this.lblCashOut.string = FormatUtils.numberWithCommas(fullCashOutValue, 2);
        }
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.visibleCashOut)
    updateCashoutButtonStatus(visibleCashOut: boolean) {
        CashOutComponent.setDisplayNode(this.node, visibleCashOut);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (cashOutHandler, cashOutValue: number) =>
        cashOutHandler.handle(cashOutValue, false)
    )
    onClickCashOut() {
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

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.disabledFullCashOut)
    disabledFullCashOut(disabledFullCashOut: boolean) {
        this.sprDisabled.node.active = disabledFullCashOut;
    }
}
