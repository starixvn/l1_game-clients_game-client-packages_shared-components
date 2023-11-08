import { _decorator, Color } from "cc";

import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../../game/bet-history/scripts/components/bet-history-body-item";

const { ccclass, property } = _decorator;

@ccclass("crash_game_bet_history_body_item")
export class CrashGameBetHistoryBodyItem extends BetHistoryBodyItem {
    setData(data: BetHistoryBodyItemType) {
        super.setData(data);

        const { betwin } = data.betHistoryLog;
        this.lblRound.color = betwin > 0 ? new Color().fromHEX("3A97FF") : new Color().fromHEX("ffffff");
        this.btnRound.interactable = betwin > 0;
    }
}
