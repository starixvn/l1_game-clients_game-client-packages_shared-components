import gc from "@sg/game-client-base";
import { _decorator, Color, Label } from "cc";
import { result } from "lodash";

import { BaseBetDetailLogItem, BetDetailLogItemType } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

const { ccclass, property } = _decorator;
const { DateTimeUtils, FormatUtils, Translator } = gc;

export interface CrashGameBetDetailsLog {
    amount: number;
    time: string;
    action: string;
    rate: number;
    rebet: boolean;
    multiplier: number;
    winAmount: number;
}

@ccclass
export class CrashGameBetDetailLogItem extends BaseBetDetailLogItem {
    @property(Label)
    lblAction: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCrashPoint: Label = null;

    @property(Label)
    lblBet: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);
        const { betDetailsLog, result } = data;
        const { amount, multiplier, winAmount, action } = betDetailsLog as CrashGameBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        const actionName = action === "cashOut" ? "cashout" : "cashout_50%";
        this.lblAction.string = Translator.gameTranslate(actionName);
        this.lblBet.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(multiplier, 2)}x`;
        this.lblWin.string = winAmount.toString();
        this.lblCrashPoint.string = result.toString();
        this.setHighlightTicketDetail(winAmount > 0);
    }
    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblMultiplier.color = color;
        this.lblBet.color = color;
    }
}
