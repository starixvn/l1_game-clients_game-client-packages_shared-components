import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { IBetLog, IBetLogDetails } from "./stores/bet-detail-store";
import BetDetailBodyItem from "./bet-detail-body-item";
import { PokerCard } from "../../../../poker-cards/scripts/poker-card";
import ResultBodyItem from "../../../../../../../../assets/game/scripts/components/bet-history/result-body-item";

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

    buildBodyRow(betLogItem: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getBetDetailItemComponent(bodyRow)?.setData(betLogItem, index, odds, settlementResult, freeBet);
        return bodyRow;
    }

    showBetDetail(betLog: IBetLog) {
        const { result, roundId, odds, settlementResult, freeBet } = betLog;

        this.lblRound.string = roundId.toString();

        const bodyRow = instantiate(this.resultPrefab);
        bodyRow.getComponent(ResultBodyItem).setData(betLog);
        this.result.addChild(bodyRow);
        // this.clearOldTable();

        // this.header.addChild(instantiate(this.headerPrefab));
        betLog.betLogDetails.forEach((item, index) => {
            this.body.addChild(this.buildBodyRow(item, index, odds, settlementResult, freeBet));
        });
    }

    clearOldTable() {
        // this.header.destroyAllChildren();
        // this.body.destroyAllChildren();
    }
}
