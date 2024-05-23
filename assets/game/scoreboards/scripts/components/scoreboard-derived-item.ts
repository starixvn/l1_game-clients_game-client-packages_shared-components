import { Node, _decorator } from "cc";
import { GridItemSettings } from "../../../../shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { BigRoadPoint } from "../helpers/scoreboard-big-road-helper";
import { ScoreboardBlinkKey, ScoreboardItemStatus } from "../models/scoreboard-item-enum";
import { ScoreboardItemState } from "../models/scoreboard-item-state";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass } = _decorator;

@ccclass
export class ScoreboardDerivedItem<T> extends ScoreboardGridItem<BigRoadPoint<T>> {
    createState(_: GridItemSettings, data?: BigRoadPoint<T>, container?: Node): ScoreboardItemState {
        return {
            status: this.getStatus(data),
            tie: 0,
        };
    }

    protected getStatus(point: BigRoadPoint<T>): ScoreboardItemStatus {
        if (this.hasBlinkNode(point)) {
            return ScoreboardItemStatus.BLINK;
        }

        if (point.status === undefined) {
            return ScoreboardItemStatus.NONE;
        }

        return point.status ? ScoreboardItemStatus.A : ScoreboardItemStatus.B;
    }

    protected hasBlinkNode(point: BigRoadPoint<T>): boolean {
        return point?.data ? point?.data[ScoreboardBlinkKey] : false;
    }
}
