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
    lblAction: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblBet: Label = null;

    @property(Node)
    nodeCrash: Node = null;

    setCrashNodeVisibility(status: boolean) {
        this.nodeCrash.active = status;
        this.lblAction.node.active = !status;
    }

    setData(data: BetDetailLogItemType) {
        super.setData(data);
        const { amount, multiplier, winAmount, action } = data.betDetailsLog as CrashGameBetDetailsLog &
            gc.BetHistory.DynamicObject<object>;

        if (action) {
            this.setCrashNodeVisibility(false);
            const actionName = action === "cashOut" ? "cashout" : "cashout_50%";
            this.lblAction.string = Translator.gameTranslate(actionName);
        } else {
            this.setCrashNodeVisibility(true);
        }

        this.lblBet.string = FormatUtils.numberWithCommas(amount, 2);
        this.lblMultiplier.string = multiplier ? `${FormatUtils.numberWithCommas(multiplier, 2)}x` : "";
        this.lblWin.string = FormatUtils.numberWithCommas(winAmount, 2);
        this.setHighlightTicketDetail(winAmount > 0);
    }
    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblMultiplier.color = color;
        this.lblBet.color = color;
    }
}
