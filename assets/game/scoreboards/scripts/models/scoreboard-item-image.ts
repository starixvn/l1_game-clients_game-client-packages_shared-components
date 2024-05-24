import { _decorator, SpriteFrame } from "cc";
import { ScoreboardItemStatus, ScoreboardItemTieCriteria } from "./scoreboard-item-enum";
import { ScoreboardItemStateCriteria } from "./scoreboard-item-state";

const { ccclass, property } = _decorator;

@ccclass("ScoreboardItemImage")
export class ScoreboardItemImage {
    @property(ScoreboardItemStateCriteria)
    forState: ScoreboardItemStateCriteria = {
        status: ScoreboardItemStatus.NONE,
        tie: ScoreboardItemTieCriteria.ZERO,
    };

    @property(SpriteFrame)
    image: SpriteFrame = null;
}
