import { _decorator, Label } from "cc";

import BetHistoryBodyItem from "../../../game/bet-history/scripts/components/bet-history-body-item";

const { ccclass, property } = _decorator;

@ccclass
export class CrashGameBetHistoryBodyItem extends BetHistoryBodyItem {
    @property({ override: true, visible: false })
    lblDate: Label = null;

    @property({ override: true, visible: false })
    lblHour: Label = null;
}
