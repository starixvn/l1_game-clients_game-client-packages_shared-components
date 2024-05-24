import { _decorator } from "cc";
import { Scoreboard } from "../../scoreboard";
import { BaccaratBeadRoadAlgorithm } from "./baccarat-bead-road-algorithm";
import { BaccaratBeadRoadItem } from "./baccarat-bead-road-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
export class BaccaratBeadRoad extends Scoreboard {
    onFocusInEditor(): void {
        super.onFocusInEditor();
        this.algorithm = this.node.getComponent(BaccaratBeadRoadAlgorithm);
    }

    onChangeMode() {
        this.grid.scrollView.content.children.forEach((node) => {
            const item = node.getComponent(BaccaratBeadRoadItem);
            item.changeMode();
        });
    }
}
