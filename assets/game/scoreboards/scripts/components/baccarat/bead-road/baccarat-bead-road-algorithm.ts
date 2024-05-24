import { _decorator } from "cc";
import { GridLayout } from "../../../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ScoreboardBeadRoadAlgorithm } from "../../scoreboard-bead-road-algorithm";
import { ScoreboardDataConverter } from "../../scoreboard-converter";
import { ScoreboardKeepDetailConverter } from "../../scoreboard-keep-detail-converter";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(ScoreboardDataConverter)
export class BaccaratBeadRoadAlgorithm extends ScoreboardBeadRoadAlgorithm {
    @property(ScoreboardKeepDetailConverter)
    protected converter: ScoreboardKeepDetailConverter = null;

    onFocusInEditor(): void {
        this.converter = this.node.getComponent(ScoreboardKeepDetailConverter);
        this.grid = this.node.getComponent(GridLayout);
    }
}
