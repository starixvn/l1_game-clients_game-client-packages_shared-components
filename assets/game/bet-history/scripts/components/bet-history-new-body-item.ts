import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "./bet-history-body-item";
const { ccclass, property } = _decorator;
const { DateTimeUtils } = gc;
const { handle } = Observer;

@ccclass
export class BetHistoryNewBodyItem extends BetHistoryBodyItem {
    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const { time } = data.betHistoryLog;
        this.lblTime.string = `${DateTimeUtils.getStringDate1(time)} ${DateTimeUtils.getString12HourByTime(time)}`;
    }

    @handle(gc.BetDetailsNew.BetDetailsHandler, (handler, payload: any) => handler.openBetDetails(payload))
    openBetDetails() {
        this.playSoundClick();
        return {
            roundId: this.betHistoryLog.roundId,
            mode: "dark",
            language: gc.Translator.getLanguageId(),
            timeZoneOffset: -new Date().getTimezoneOffset() / 60,
        };
    }
}
