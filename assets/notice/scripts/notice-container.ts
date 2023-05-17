import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { observer, render, handle, useObserver } = Observer;

const { Notices } = gc;
const { ccclass, property } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    @property
    namespaceObserver = "default";

    private dispose: any;
    onLoad() {
        this.dispose = useObserver(this, this.namespaceObserver);
    }

    onDestroy() {
        this.dispose();
    }

    @render(Notices.NoticeStore, (store) => store.notice, { fireImmediately: false })
    showNotice(notice: gc.Notices.Notice) {
        console.log("renderNotice", notice);
        const node = this.createNode();
        const noticeCmp = node.getComponent(NoticeCmp);
        noticeCmp.setData(notice);
    }
}
