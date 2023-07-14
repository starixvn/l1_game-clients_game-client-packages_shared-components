import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { IBetLog, IBetLogDetails } from "./stores/bet-detail-store";
import BetDetailBodyItem from "./bet-detail-body-item";
import { convertRank, PokerCard } from "../../../../poker-cards/scripts/poker-card";
import { BetChoice, Choice } from "../../../../../../../../assets/game/scripts/components/dtf-commons";

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

    @property(PokerCard)
    cards: PokerCard[] = [];

    @property(Label)
    dragonRank: Label = null;

    @property(Label)
    tigerRank: Label = null;

    @property(Label)
    lblRound: Label = null;

    getBetDetailItemComponent(node: Node) {
        return node.getComponent(BetDetailBodyItem);
    }

    buildBodyRow(betLogItem: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        this.getBetDetailItemComponent(bodyRow)?.setData(betLogItem, index, odds, settlementResult, freeBet);
        return bodyRow;
    }

    showBetDetail(begLog: IBetLog) {
        const { result, roundId, odds, settlementResult, freeBet } = begLog;

        this.lblRound.string = roundId.toString();
        const dragonCard = result[BetChoice.Dragon];
        this.cards[Choice.Dragon].setServiceCard(dragonCard);
        this.cards[Choice.Dragon].faceUp();
        this.dragonRank.string = convertRank(dragonCard.rank);

        const tigerCard = result[BetChoice.Tiger];
        this.cards[Choice.Tiger].setServiceCard(tigerCard);
        this.cards[Choice.Tiger].faceUp();
        this.tigerRank.string = convertRank(tigerCard.rank);

        // this.clearOldTable();

        // this.header.addChild(instantiate(this.headerPrefab));
        begLog.betLogDetails.forEach((item, index) => {
            this.body.addChild(this.buildBodyRow(item, index, odds, settlementResult, freeBet));
        });
    }

    clearOldTable() {
        // this.header.destroyAllChildren();
        // this.body.destroyAllChildren();
    }
}
