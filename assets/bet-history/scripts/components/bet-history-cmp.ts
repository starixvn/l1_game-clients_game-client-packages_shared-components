import { _decorator, Label, Node } from "cc";
import { Dialog } from "../../../dialogs/dialog";
const { ccclass, property } = _decorator;
import gc from "game-client-base";

@ccclass()
export class BetHistoryCmp extends Dialog {
    setData(data: gc.BetHistory.BetHistoryModel) {}

    onClosed() {
        this.hide();
    }
}
