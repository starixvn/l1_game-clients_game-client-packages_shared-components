import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import BetHistoryBodyItem, { BetHistoryBodyItemType } from "../../../game/bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;
const { handle } = Observer;

const { CutCardPF } = gc;

@ccclass
export class BaccaratXBetHistorybodyItem extends BetHistoryBodyItem {
    @property(Label)
    lblWinLoss: Label = null;

    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        this.lblWinLoss.string = data.betHistoryLog.winLoss.toString();
    }

    @handle(CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickFairness() {
        this.playSoundClick();
        //return this.betHistoryLog.roundId;
        return 20769;
    }
}
