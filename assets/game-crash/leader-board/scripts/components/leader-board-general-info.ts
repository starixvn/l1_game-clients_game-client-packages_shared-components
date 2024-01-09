import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, FormatUtils } = gc;

@ccclass
export class LeaderBoardGeneralInfo extends ObserverComponent {
    @property(Label)
    lblNoOfPlayersBet: Label = null;

    @property(Label)
    lblNoOfPlayerCashOut: Label = null;

    @property(Label)
    lblTotalCashOut: Label = null;

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.noOfPlayerBet, { fireImmediately: false })
    private updateNoOfPlayersBet(noOfPlayers: number) {
        this.lblNoOfPlayersBet.string = noOfPlayers.toString();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.noOfPlayerCashOut, { fireImmediately: false })
    private updateNoOfPlayersCashOut(noOfPlayerCashOut: number) {
        this.lblNoOfPlayerCashOut.string = noOfPlayerCashOut.toString();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.totalCashOut, { fireImmediately: false })
    private updateTotalCashOut(totalCashOut: number) {
        this.lblTotalCashOut.string = FormatUtils.numberWithCommas(totalCashOut, 2, false);
    }
}
