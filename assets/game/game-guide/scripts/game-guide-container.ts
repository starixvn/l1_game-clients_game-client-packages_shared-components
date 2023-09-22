import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { InGameMenuStore } from "../../in-game-menu/scripts/stores/in-game-menu-store";
import { InGameMenuEvents } from "../../in-game-menu/scripts/stores/in-game-menu-events";
import WebViewGuide from "./web-view-guide";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass("GameGuideContainer")
export class GameGuideContainer extends NodeContainer {
    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_GUIDE) {
            this.openDialog();
        }
    }

    protected openDialog() {
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.initUrl();
    }
}
