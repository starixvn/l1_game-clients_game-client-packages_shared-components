import { _decorator, Component } from "cc";
import { ScoreboardItem } from "../components/scoreboard-item";
import { ScoreboardItemImage } from "../models/scoreboard-item-image";
import { ScoreboardItemState, ScoreboardItemStateCriteria } from "../models/scoreboard-item-state";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardItemRenderer extends Component {
    @property(ScoreboardItemStateCriteria)
    forState: ScoreboardItemStateCriteria = null;

    render(state?: ScoreboardItemState, images?: ScoreboardItemImage[], item?: ScoreboardItem) {
        this.node.active = true;
    }

    reset(): void {
        this.node.active = false;
    }
}
