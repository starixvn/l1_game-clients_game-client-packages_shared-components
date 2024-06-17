import gc from "@sg/game-client-base";
import { Color, Label, _decorator } from "cc";
import * as i18n from "db://i18n/LanguageData";
import Observer from "observer";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../../game/bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;
const { handle } = Observer;

const { CutCardPF, FormatUtils, BetDetailsNew } = gc;

@ccclass
export class BaccaratXBetHistorybodyItem extends BetHistoryBodyItem {
    @property(Label)
    lblWinLoss: Label = null;

    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const winloss = data.betHistoryLog.betwin - data.betHistoryLog.totalAmount;
        this.lblWinLoss.string = FormatUtils.numberWithCommas(winloss, 2);
        this.lblWinLoss.color = winloss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("EB3D26");
    }

    @handle(CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickFairness() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }

    @handle(BetDetailsNew.BetDetailsHandler, (handler, payload: any) => handler.openBetDetails(payload))
    openBetDetails() {
        return {
            roundId: this.betHistoryLog.roundId,
            mode: "dark",
            language: i18n._language,
            timeZoneOffset: new Date().getTimezoneOffset() / 60,
        };
    }
}
