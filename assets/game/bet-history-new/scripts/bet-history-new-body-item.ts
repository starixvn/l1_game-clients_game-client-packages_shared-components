import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;
const { DateTimeUtils } = gc;
const { handle } = Observer;

@ccclass
export class BetHistoryNewBodyItem extends BetHistoryBodyItem {
    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const { time } = data.betHistoryLog;
        this.lblTime && (this.lblTime.string = `${DateTimeUtils.getStringDate1(time)} ${DateTimeUtils.getString12HourByTime(time)}`);
    }
}
