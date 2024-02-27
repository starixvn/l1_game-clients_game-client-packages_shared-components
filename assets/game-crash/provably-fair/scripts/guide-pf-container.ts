import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import WebViewGuide from "../../../game/game-guide/scripts/web-view-guide";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class GuidePFContainer extends NodeContainer {
    @render(gc.GuidePF.GuidePFStore, (store) => store.url, { fireImmediately: false })
    protected openDialog(url: string) {
        if (url === "") {
            return;
        }
        const guide = this.createNode();
        guide.getComponent(WebViewGuide)?.loadGameGuide(url);
    }
}
