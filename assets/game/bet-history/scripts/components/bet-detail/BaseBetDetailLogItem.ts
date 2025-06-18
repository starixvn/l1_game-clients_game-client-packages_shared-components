import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BetDetailLogItemType, GameRoundBetDetailsLog } from "./bet-detail-log-item";

const { property } = _decorator;
const { DateTimeUtils } = gc;

export class BaseBetDetailLogItem extends ObserverComponent {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    refundChoices: string[] = [];
    refundRatio = 0.5;

    setData(data: BetDetailLogItemType) {
        const { index, betDetailsLog } = data;
        const { time } = betDetailsLog as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>;

        this.nodeBackground.active = index % 2 > 0;
        this.lblTime && (this.lblTime.string = time ? DateTimeUtils.formatDateTime(time) : "");
    }
}
