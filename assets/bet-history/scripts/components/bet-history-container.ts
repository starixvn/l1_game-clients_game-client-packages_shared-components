import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { BetHistoryCmp } from "./bet-history-cmp";
import { NodeContainer } from "../../../node-container/node-container";

const { render } = Observer;

const { BetHistory } = gc;
const { ccclass } = _decorator;

@ccclass("BetHistoryContainer")
export class BetHistoryContainer extends NodeContainer {
    // @render(BetHistory.BetHistoryStore, (store) => store.data, { fireImmediately: false })
    showBetHistory(model: gc.BetHistory.BetHistoryModel) {
        // console.log("open Bet History", model);
        // const node = this.createNode();
        // const betHistoryCmp = node.getComponent(BetHistoryCmp);
        // betHistoryCmp.setData(model);
    }
}
