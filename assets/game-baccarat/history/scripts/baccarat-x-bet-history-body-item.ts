import gc from "@sg/game-client-base";
import { Color, Label, Node, _decorator } from "cc";
import Observer from "observer";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../../game/bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;
const { handle } = Observer;

const { GameBaccaratX, FormatUtils, BetDetailsNew, DateTimeUtils } = gc;

@ccclass
export class BaccaratXBetHistorybodyItem extends BetHistoryBodyItem {
    @property(Label)
    lblWinLoss: Label = null;

    @property(Node)
    nodeDisabledVerify: Node = null;

    @property(Label)
    lblVerify: Label = null;

    setData(data: BetHistoryBodyItemType) {
        const { betwin, totalAmount, verifiable, time } = data.betHistoryLog;
        super.setData(data);
        const winloss = betwin - totalAmount;
        this.lblWinLoss.string = FormatUtils.numberWithCommas(winloss, 2);
        this.lblWinLoss.color = winloss >= 0 ? new Color().fromHEX("F1E344") : new Color().fromHEX("EB3D26");
        this.nodeDisabledVerify.active = !verifiable;
        this.lblVerify.color = verifiable ? new Color().fromHEX("0055FF") : new Color().fromHEX("586379");
        this.lblTime.string = `${DateTimeUtils.getStringDate1(time)} ${DateTimeUtils.getString12HourByTime(time)}`;
    }

    @handle(GameBaccaratX.CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickFairness() {
        this.playSoundClick();
        return this.betHistoryLog.roundId;
    }

    @handle(BetDetailsNew.BetDetailsHandler, (handler, payload: any) => handler.openBetDetails(payload))
    openBetDetails() {
        return {
            roundId: this.betHistoryLog.roundId,
            mode: "dark",
            language: gc.Translator.getLanguageId(),
            timeZoneOffset: -new Date().getTimezoneOffset() / 60,
        };
    }
}
