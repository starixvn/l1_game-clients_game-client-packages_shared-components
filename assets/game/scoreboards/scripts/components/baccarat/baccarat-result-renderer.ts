import { Label, _decorator } from "cc";
import { ScoreboardItemState } from "../../models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "../../renderers/scoreboard-item-renderer";
const { ccclass, property } = _decorator;
@ccclass
export class BaccaratResultRenderer extends ScoreboardItemRenderer {
    render(state?: ScoreboardItemState, images?: any[], item?: any) {
        const data = state.data;
        if (!data) {
            return;
        }
        this.node.active =
            data[this.node.name] || (Array.isArray(data) && data.some((settlementResult) => settlementResult[this.node.name]));

        const label = this.node.getComponent(Label);
        if (label) {
            label.string = `${data["score"]}`;
            this.node.active = true;
        }
    }

    reset(): void {
        this.node.active = false;
    }
}
