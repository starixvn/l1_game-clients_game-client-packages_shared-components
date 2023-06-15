import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { WarningCmp } from "./warning-cmp";

const { render } = Observer;

const { Notices } = gc;
const { ccclass } = _decorator;

@ccclass("WarningContainer")
export class WarningContainer extends NodeContainer {
    @render(Notices.NoticeStore, (store) => store.warning, { fireImmediately: false })
    showWarning(warning) {
        const node = this.createNode();
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(warning.message);
    }
}
