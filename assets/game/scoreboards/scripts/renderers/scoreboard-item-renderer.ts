import { _decorator, Component } from "cc";
import { ScoreboardItemStatus, ScoreboardItemTieCriteria } from "../models/scoreboard-item-enum";
import { ScoreboardItemImage } from "../models/scoreboard-item-image";
import { ScoreboardItemState, ScoreboardItemStateCriteria } from "../models/scoreboard-item-state";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardItemRenderer extends Component {
    @property(ScoreboardItemStateCriteria)
    forState: ScoreboardItemStateCriteria = {
        status: ScoreboardItemStatus.NONE,
        tie: ScoreboardItemTieCriteria.ZERO,
    };

    render(state?: ScoreboardItemState, images?: ScoreboardItemImage[], item?: any) {
        this.node.active = true;
    }

    reset(): void {
        this.node.active = false;
    }
}
