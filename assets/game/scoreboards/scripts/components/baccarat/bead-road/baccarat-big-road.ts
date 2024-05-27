import { _decorator } from "cc";
import { GridLayout } from "../../../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { Scoreboard } from "../../scoreboard";
import { ScoreboardBigRoadAlgorithm } from "../../scoreboard-big-road-algorithm";
import { ScoreboardKeepDetailConverter } from "../../scoreboard-keep-detail-converter";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([GridLayout, ScoreboardKeepDetailConverter, ScoreboardBigRoadAlgorithm])
export class BaccaratBigRoad extends Scoreboard {}
