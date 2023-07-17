import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "./bet-detail-body-item";
import ResultBodyItem from "../../../../../../../../assets/game/scripts/components/bet-history/result-body-item";
import { IBetLogDetails, IBetDetailModel } from "./stores/bet-detail-store";

const { ccclass, property } = _decorator;

export interface IBetHistoryTable {
    showBetHistory(model: gc.BetHistory.BetHistoryModel): void;
}

@ccclass()
export class BetDetailTable extends Component {
    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    @property(Label)
    lblRound: Label = null;

    @property(Prefab)
    resultPrefab: Prefab = null;

    @property(Node)
    result: Node = null;

    getBetDetailItemComponent(node: Node) {
        return node.getComponent(BetDetailBodyItem);
    }

    buildBodyRow(betLogItem: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean, fractionalOddsFormat: boolean): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getBetDetailItemComponent(bodyRow)?.setData(betLogItem, index, odds, settlementResult, freeBet, fractionalOddsFormat);
        return bodyRow;
    }

    showBetDetail(model: IBetDetailModel) {
        const {betLog, fractionalOddsFormat}= model;
        const { odds, settlementResult, freeBet } = betLog;

        const bodyRow = instantiate(this.resultPrefab);
        bodyRow.getComponent(ResultBodyItem).setData(betLog);
        this.result.addChild(bodyRow);

        betLog.betLogDetails.forEach((item, index) => {
            this.body.addChild(this.buildBodyRow(item, index, odds, settlementResult, freeBet, fractionalOddsFormat));
        });
    }

}
