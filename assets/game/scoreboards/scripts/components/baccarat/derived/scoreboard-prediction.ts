import { _decorator, Component } from "cc";
import { ScoreboardPredictionItem } from "./scoreboard-prediction-item";

const { ccclass, property } = _decorator;

@ccclass
export class ScoreboardPrediction extends Component {
    items: ScoreboardPredictionItem[] = [];
    protected onLoad(): void {
        this.items = this.getComponentsInChildren(ScoreboardPredictionItem);
    }

    setData(data: boolean[]): void {
        this.items.forEach((item, index) => {
            const invert = index > 0;
            item.setData(data, invert);
        });
    }
}
