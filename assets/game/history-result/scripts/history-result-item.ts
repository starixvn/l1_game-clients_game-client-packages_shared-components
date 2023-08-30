import gc from "@sg/game-client-base";
import { _decorator, Component, Sprite } from "cc";
import { HistoryResultItemModel } from "./history-result-item-model";
const { ccclass, property } = _decorator;

@ccclass("HistoryResultItem")
export class HistoryResultItem extends Component {
    @property(Sprite)
    icon1: Sprite = null;

    @property(Sprite)
    icon2: Sprite = null;

    @property(Sprite)
    icon3: Sprite = null;

    @property(Node)
    highlight: Node = null;

    @property({ type: HistoryResultItemModel })
    itemModel: HistoryResultItemModel[] = [];

    public historyResultItemData: gc.RoundHistories.RoundHistory = null;

    public setHistoryResultItemData(round: gc.RoundHistories.RoundHistory): void {
        this.historyResultItemData = round;
        console.log("setHistoryResultItemData", this.historyResultItemData);
    }
}
