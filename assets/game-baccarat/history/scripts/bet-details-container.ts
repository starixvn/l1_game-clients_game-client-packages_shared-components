import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { InGameMenuEvents } from "../../../game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../game/in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { BetTicketDetails } from "./bet-ticket-details";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { BetDetailsNew } = gc;

@ccclass
export class BetDetailsContainer extends NodeContainer {
    @render(BetDetailsNew.BetDetailsStore, (store) => store.betDetailsUrl, { fireImmediately: false })
    renderContent(betDetailsUrl: string) {
        if (betDetailsUrl === "") {
            return;
        }
        const guide = this.createNode();
        guide.getComponent(BetTicketDetails)?.openBetDetails(betDetailsUrl);
    }

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    closeBetDetails(event: string) {
        if (event === InGameMenuEvents.CLOSE_GAME) {
            this.node.removeAllChildren();
        }
    }
}
