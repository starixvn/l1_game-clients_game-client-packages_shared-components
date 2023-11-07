import { _decorator, Color, Label, Node } from "cc";
import gc from "@sg/game-client-base";
import { BaseBetDetailLogItem, BetDetailLogItemType } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

const { property } = _decorator;
const { DateTimeUtils, FormatUtils, Translator } = gc;

export interface CrashGameBetDetailsLog {
    amount: number;
    time: string;
    choice: string;
    rate: number;
    rebet: boolean;
    multiplier: number;
}

export default class CrashGameBetDetailLogItem extends BaseBetDetailLogItem {
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
        const { time, amount, multiplier } = betDetailsLog as CrashGameBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime.string = DateTimeUtils.formatDateTime(time);
        this.lblOption.string = "Cash"; // Translator.gameTranslate(`glossary_${choice}`);
        this.lblBet.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(multiplier, 2)}x`;
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblOption.color = color;
        this.lblMultiplier.color = color;
        this.lblBet.color = color;
    }
}
