import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { BetHistory } = gc;
const { handle } = Observer;

export type BetHistoryBodyItemType = {
    betHistoryLog: gc.BetHistory.BetHistoryLog;
    index: number;
    resultPrefab: Prefab | null;
};

@ccclass
export default class BetHistoryBodyItem extends ObserverComponent {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblTotalStake: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    @property(Button)
    btnRound: Button = null;

    @property(Node)
    result: Node = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(data: BetHistoryBodyItemType) {
        const { betHistoryLog, index, resultPrefab } = data;
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId, totalAmount } = betHistoryLog;

        this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
        this.lblRound.string = roundId.toString();

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);

        if (resultPrefab) {
            const bodyRow = instantiate(resultPrefab);
            const { result, settlementResult } = betHistoryLog;
            bodyRow.getComponent(BaseResultBodyItem)?.setData(result as gc.BetHistory.DynamicObject<object>, settlementResult);
            this.result.addChild(bodyRow);
        }
    }

    @handle(BetHistory.BetDetailHitoryStore, (store, betHistoryLog: gc.BetHistory.BetHistoryLog) => {
        // TO DO
        // if (betHistoryLog.betLogDetails?.length > 0) {
        //     store.setData(betHistoryLog);
        // }
        const betLogDetails = [];

        for (var i = 0; i < 20; i++) {
            betLogDetails.push({
                amount: 1 + i,
                time: new Date(),
                choice: "Cash Test",
                rate: 15 + i,
                rebet: false,
            });
        }

        store.setData({
            time: new Date().toDateString(),
            roundId: 1569,
            win: 5900,
            betwin: 5900,
            totalAmount: 10,
            freeBet: false,
            odds: {},
            result: {},
            settlementResult: {},
            betLogDetails,
        });
    })
    openTicketDetail() {
        if (this.betHistoryLog.betLogDetails?.length > 0) {
            this.playSoundClick();
        }

        // TO DO
        return this.betHistoryLog;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}

export class BaseResultBodyItem extends Component {
    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {}
}
