import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { InGameMenuEvents } from "../../in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../in-game-menu/scripts/stores/in-game-menu-store";
import WebViewGuide from "./web-view-guide";

const { render } = Observer;
const { ccclass } = _decorator;

@ccclass("GameGuideContainer")
export class GameGuideContainer extends NodeContainer {
    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_GUIDE) {
            this.openDialog(false);
        } else if (event === InGameMenuEvents.OPEN_GUIDE_SCROLL_MD5) {
            this.openDialog(true);
        }
    }

    protected openDialog(isScrollMd5: boolean) {
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.initUrl("", isScrollMd5);
    }
}
