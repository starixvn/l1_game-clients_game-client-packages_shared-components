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

    @render(DisabledGame.DisabledGameStore, (store) => store.noticeDisable)
    renderUMNotice(noticeDisable: gc.Notices.Notice) {
        if (!noticeDisable) {
            this.noticeCmp?.hide();
            return;
        }

        if (!this.noticeCmp) {
            const node = this.createNode();
            this.noticeCmp = node.getComponent<NoticeCmp>(NoticeCmp);
            this.noticeCmp.setData(noticeDisable);
        }
    }
}
