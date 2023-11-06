import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import BaseBetDetailBodyItem from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-body-item";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

export type BetLogDetail = {
    action: string;
    amount: number;
    winAmount: number;
    multiplier: number;
} & gc.BetHistory.BetDetailsLog;

@ccclass
export default class BetDetailBodyItem extends BaseBetDetailBodyItem {
    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblResult: Label = null;

    @property(Label)
    lblAction: Label = null;

    setData(
        betDetailsLog: BetLogDetail,
        index: number,
        odds: gc.BetHistory.DynamicObject<number>,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        result: gc.BetHistory.DynamicObject<Object>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {
        const { amount, time, action, winAmount } = betDetailsLog;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime.string = gc.DateTimeUtils.formatDateTime(time);
        this.lblMultiplier.string = `${betDetailsLog.multiplier.toFixed(2)}x`;
        this.lblAction.string = action;
        this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblWin.string = FormatUtils.numberWithCommas(winAmount, 2);
    }
}
