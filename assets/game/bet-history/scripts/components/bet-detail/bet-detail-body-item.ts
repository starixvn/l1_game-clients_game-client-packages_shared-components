import { _decorator, Color, Label, Node } from "cc";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../../shared/common-components/observer-component/scripts/observer-component";

const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;

export default class BetDetailBodyItem extends ObserverComponent {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblOdds: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblChoice: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    choiceMapping = {};

    setData(
        betDetailsLog: gc.BetHistory.BetDetailsLog,
        index: number,
        odd: number,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {
        const { time, amount, choice } = betDetailsLog;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime.string = DateTimeUtils.formatDateTime(time);
        this.lblChoice.string = this.choiceMapping[choice];
        this.lblOdds.string = (fractionalOddsFormat ? FormatUtils.numberWithCommas(+odd - 1, 2) : odd).toString();
        this.lblAmount.string = FormatUtils.numberWithCommas(amount, 2);
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
    }
}
