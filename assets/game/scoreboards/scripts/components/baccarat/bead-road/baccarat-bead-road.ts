import { _decorator } from "cc";
import { Scoreboard } from "../../scoreboard";
import { ScoreboardBeadRoadAlgorithm } from "../../scoreboard-bead-road-algorithm";
import { ScoreboardKeepDetailConverter } from "../../scoreboard-keep-detail-converter";
import { BaccaratBeadRoadItem } from "./baccarat-bead-road-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([ScoreboardKeepDetailConverter, ScoreboardBeadRoadAlgorithm])
export class BaccaratBeadRoad extends Scoreboard {
    onChangeMode() {
        this.grid.scrollView.content.children.forEach((node) => {
            const item = node.getComponent(BaccaratBeadRoadItem);
            item.changeMode();
        });
    }
}
