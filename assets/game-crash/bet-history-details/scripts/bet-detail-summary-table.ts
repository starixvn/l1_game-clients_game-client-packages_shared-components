import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";

const { ccclass, property } = _decorator;

@ccclass()
export class BetDetailSummaryTable extends Component {
    @property(Label)
    lblRound: Label = null;

    renderResult(model: gc.BetHistory.BetDetailModel) {
        this.lblRound.string = model.betHistoryLog.roundId.toString();
    }
}
