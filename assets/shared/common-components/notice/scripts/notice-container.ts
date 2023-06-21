import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { render } = Observer;

const { Notices } = gc;
const { ccclass } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    @render(Notices.NoticeStore, (store) => store.notice, { fireImmediately: false })
    showNotice(notice: gc.Notices.Notice) {
        if (this.visibility) {
            const node = this.createNode();
            const noticeCmp = node.getComponent(NoticeCmp);
            noticeCmp.setData(notice);
        }
    }
}
