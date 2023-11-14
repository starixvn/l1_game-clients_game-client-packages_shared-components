import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";

const { ccclass, property } = _decorator;
const { DateTimeUtils, FormatUtils, Translator } = gc;

export interface GameRoundBetDetailsLog {
    amount: number;
    time: string;
    choice: string;
    rate: number;
    rebet: boolean;
}

export type BetDetailLogItemType = {
    betDetailsLog: gc.BetHistory.DynamicObject<object>;
    index: number;
    odds: gc.BetHistory.DynamicObject<number>;
    settlementResult: gc.BetHistory.DynamicObject<boolean>;
    result: gc.BetHistory.DynamicObject<object>;
    freeBet: boolean;
    fractionalOddsFormat: boolean;
};

export class BaseBetDetailLogItem extends Component {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    setData(data: BetDetailLogItemType) {
        const { index, betDetailsLog } = data;
        const { time } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime.string = time ? DateTimeUtils.formatDateTime(time) : "";
    }
}

@ccclass
export default class BetDetailLogItem extends BaseBetDetailLogItem {
    @property(Label)
    lblOdds: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblChoice: Label = null;

    setData(data: BetDetailLogItemType) {
        super.setData(data);

        const { betDetailsLog } = data;
        const { amount, choice } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.lblChoice.string = Translator.gameTranslate(`glossary_${choice}`);
        this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
    }
}
