import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { BaseBetDetailSummaryTable } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-summary-table";

const { ccclass, property } = _decorator;

@ccclass()
export class BetDetailSummaryTable extends BaseBetDetailSummaryTable {
    @property(Label)
    lblRound: Label = null;

    renderResult(model: gc.BetHistory.BetDetailModel) {
        this.lblRound.string = model.betHistoryLog.roundId.toString();
    }
}
