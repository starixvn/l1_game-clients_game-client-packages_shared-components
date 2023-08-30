import gc from "@sg/game-client-base";
import { _decorator, Node, Prefab } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { HistoryResultItem } from "./history-result-item";
const { ccclass, property } = _decorator;

@ccclass("HistoryResult")
export class HistoryResult extends ObserverComponent {
    @property(Node)
    containerItem: Node = null;

    @property(Prefab)
    historyResultItem: Prefab = null;

    protected historyResultItems: HistoryResultItem[] = [];
    protected rounds: gc.RoundHistories.RoundHistory[] = [];

    onLoad() {
        super.onLoad();
        this.createHistoryItems();
    }

    protected createHistoryItems() {
        this.containerItem.destroyAllChildren();
        console.log("createHistoryItems");
    }
}
