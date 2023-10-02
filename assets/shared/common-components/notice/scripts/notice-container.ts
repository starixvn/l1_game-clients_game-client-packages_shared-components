import gc from "@sg/game-client-base";
import { _decorator, game } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { render } = Observer;

const { Notices, DisabledGame } = gc;
const { ccclass } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    noticeCmp: NoticeCmp = null;

    @render(Notices.NoticeStore, (store) => store.notice, { fireImmediately: false })
    showNotice(notice: gc.Notices.Notice) {
        if (!game.isPaused() && notice) {
            const node = this.createNode();
            const noticeCmp = node.getComponent<NoticeCmp>(NoticeCmp);
            this.noticeCmp = noticeCmp;
            noticeCmp.setData(notice);
        }
    }

    @render(DisabledGame.DisabledGameStore, (store) => store.showPopup, { fireImmediately: false })
    hideNotice(showPopup: boolean) {
        if (!showPopup && this.noticeCmp) {
            this.noticeCmp.hide();
        }
    }
}
