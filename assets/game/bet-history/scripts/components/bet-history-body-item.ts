import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";

const { property, ccclass } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { BetHistory } = gc;
const { handle } = Observer;

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

    @property(Prefab)
    resultPrefab: Prefab = null;

    @property(Node)
    result: Node = null;

    betHistoryLog: gc.BetHistory.BetHistoryLog = null;

    setData(betHistoryLog: gc.BetHistory.BetHistoryLog, index: number) {
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId, totalAmount } = betHistoryLog;

        this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
        this.lblRound.string = roundId.toString();

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);

        const bodyRow = instantiate(this.resultPrefab);
        const { result, settlementResult } = betHistoryLog;
        bodyRow.getComponent(BaseResultBodyItem).setData(result as gc.BetHistory.DynamicObject<object>, settlementResult);
        this.result.addChild(bodyRow);
    }

    @handle(BetHistory.BetDetailHitoryStore, (store, betHistoryLog: gc.BetHistory.BetHistoryLog) => {
        store.setData(betHistoryLog);
    })
    openTicketDetail() {
        this.playSoundClick();
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
