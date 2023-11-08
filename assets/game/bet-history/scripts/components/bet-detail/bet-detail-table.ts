import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { BaseBetDetailSummaryTable } from "./bet-detail-summary-table";
import { BetDetailLogTable } from "./bet-detail-log-table";

const { ccclass, property } = _decorator;

export type BetDetailTableType = {
    model: gc.BetHistory.BetDetailModel;
    resultContentPrefab: Prefab;
    betDetailSummaryPrefab: Prefab;
    betDetailLogTablePrefab: Prefab;
    logDetailItemPrefab: Prefab;
};

@ccclass()
export class BetDetailTable extends Component {
    @property(Node)
    nodeBetDetailSummaryTable: Node = null;

    @property(Node)
    nodeBetDetailLogTablePrefab: Node = null;

    showBetDetail(data: BetDetailTableType) {
        const { model, resultContentPrefab, betDetailSummaryPrefab, logDetailItemPrefab, betDetailLogTablePrefab } = data;

        const betDetailLogTable = instantiate(betDetailLogTablePrefab);
        betDetailLogTable.getComponent(BetDetailLogTable).showBetDetail(logDetailItemPrefab, model);
        this.nodeBetDetailLogTablePrefab.addChild(betDetailLogTable);

        const betDetailSummaryTable = instantiate(betDetailSummaryPrefab);
        betDetailSummaryTable?.getComponent(BaseBetDetailSummaryTable).renderResult(model, resultContentPrefab);
        this.nodeBetDetailSummaryTable?.addChild(betDetailSummaryTable);
    }
}
