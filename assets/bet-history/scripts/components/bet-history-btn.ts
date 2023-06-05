import { _decorator, Component, director } from "cc";
const { ccclass, property } = _decorator;
import gc from "game-client-base";
import Observer from "observer";
const { BetHistory } = gc;

const { render, handle, observer } = Observer;

@ccclass
export class BtnBetHistory extends Component {
    onClick() {
        this.handleShowBetHistory();
        console.log("BtnBetHistory click");
    }
    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler)
    handleShowBetHistory() {}
}
