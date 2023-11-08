import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Node } from "cc";

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
    lblTime: Label = null;

    @property(Label)
    lblOption: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashPoint: Label = null;

    @property(Label)
    lblBet: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    setData(data: BetDetailLogItemType) {
        const { betDetailsLog, index } = data;
        const { time, amount, multiplier, winAmount, action } = betDetailsLog as CrashGameBetDetailsLog &
            gc.BetHistory.DynamicObject<object>;

        const actionName = action === "cashOut" ? "cashout" : "cashout_50%";
        this.lblOption.string = Translator.gameTranslate(actionName);

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime.string = DateTimeUtils.formatDateTime(time);
        this.lblBet.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(multiplier, 2)}x`;
        this.lblWin.string = winAmount.toString();
        this.setHighlightTicketDetail(winAmount > 0);
    }
    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblMultiplier.color = color;
        this.lblBet.color = color;
    }
}
