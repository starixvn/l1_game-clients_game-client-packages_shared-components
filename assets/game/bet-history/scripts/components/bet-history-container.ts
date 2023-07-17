import { Node, _decorator } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../../shared/common-components/node-container/node-container";
import { BetHistoryTable } from "./bet-history-table";
import { InGameMenuStore } from "../../../in-game-menu/scripts/stores/in-game-menu-store";
import { InGameMenuEvents } from "../../../in-game-menu/scripts/stores/in-game-menu-events";

const { ccclass } = _decorator;
const { render, handle } = Observer;
const { BetHistory } = gc;

@ccclass("BetHistoryContainer")
export class BetHistoryContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: BetHistoryTable = null;

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler) => handler.handle(1))
    hanldeShowBetHistory() {}

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openBetHistory({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_HISTORY) {
            this.hanldeShowBetHistory();
        }
    }

    @render(BetHistory.BetHistoryStore, (store) => {
        return {
            betHistoryModel:store.betHistoryModel,
            fractionalOddsFormat: store.fractionalOddsFormat
}}, { fireImmediately: false })
    showBetHistory({betHistoryModel, fractionalOddsFormat}) {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetHistoryTable);
        }

        this.table.showBetHistory(betHistoryModel, fractionalOddsFormat);
    }
}
