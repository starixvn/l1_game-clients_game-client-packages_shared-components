import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { WarningCmp } from "./warning-cmp";

const { observer, render, handle, useObserver } = Observer;

const { Notices } = gc;
const { ccclass, property } = _decorator;

@ccclass("WarningContainer")
export class WarningContainer extends NodeContainer {
    @property
    namespaceObserver = "default";

    private dispose: any;
    onLoad() {
        this.dispose = useObserver(this, this.namespaceObserver);
    }

    onDestroy() {
        this.dispose();
    }

    @render(Notices.NoticeStore, (store) => store.warning, { fireImmediately: false })
    showWarning(warning) {
        const node = this.createNode();
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(warning.message);
    }
}
