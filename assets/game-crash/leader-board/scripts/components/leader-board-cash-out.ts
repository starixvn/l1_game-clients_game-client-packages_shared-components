import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;
const { render, handle } = Observer;

interface ILeaderBoardCashOutData {
    name: string;
    multiplier: number;
    win: number;
    amount: number;
}

@ccclass
export class LeaderBoardCashOut extends ObserverComponent {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashout: Label = null;

    @property(Label)
    lblBetAmount: Label = null;

    setData(data: ILeaderBoardCashOutData) {
        const { name, multiplier, win, amount } = data;
        this.lblName.string = name;
        this.lblMultiplier.string = multiplier ? `${FormatUtils.numberWithCommas(multiplier, 2, false)}x` : "-";

        this.lblCashout.node.active = false;
        this.lblBetAmount.node.active = false;

        if (!!win) {
            this.lblCashout.node.active = true;
            this.lblCashout.string = FormatUtils.numberWithCommas(win, 2);
        } else {
            this.lblBetAmount.node.active = true;
            this.lblBetAmount.string = FormatUtils.numberWithCommas(amount, 2);
        }
    }

    @render(gc.GameCrash.CrashBetList.CrashBetListStore, (store) => store.isNeedEmptyBetAmount)
    emptyBetAmount(isNeedEmptyBetAmount: boolean) {
        if (!isNeedEmptyBetAmount) {
            return;
        }

        this.lblBetAmount.string = "-";
    }
}
