import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "./bet-detail-body-item";
import { BaseResultBodyItem } from "../bet-history-body-item";

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

    buildBodyRow(
        betLogItem: gc.BetHistory.BetDetailsLog,
        index: number,
        odds: gc.BetHistory.DynamicObject<number>,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        const { choice } = betLogItem;

        this.getBetDetailItemComponent(bodyRow)?.setData(
            betLogItem,
            index,
            odds[choice],
            settlementResult[choice],
            freeBet,
            fractionalOddsFormat
        );

        return bodyRow;
    }

    showBetDetail(model: gc.BetHistory.BetDetailModel) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;

        const bodyRow = instantiate(this.resultPrefab);
        bodyRow.getComponent(BaseResultBodyItem).setData(result, settlementResult);
        this.result.addChild(bodyRow);

        betLogDetails.forEach((item, index) => {
            this.body.addChild(this.buildBodyRow(item, index, odds, settlementResult, freeBet, fractionalOddsFormat));
        });
    }
}
