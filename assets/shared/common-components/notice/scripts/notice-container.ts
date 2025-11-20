import gc from "@sg/game-client-base";
import { _decorator, game } from "cc";
import { GameGuideUtils } from "db://shared-components/game/game-guide/scripts/utils/game-guide-utils";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { NoticeCmp } from "./notice-cmp";

const { render, handle } = Observer;

const { Notices, DisabledGame, Auth } = gc;
const { ccclass } = _decorator;

@ccclass("NoticeContainer")
export class NoticeContainer extends NodeContainer {
    noticeCmp: NoticeCmp = null;
    private appType = 0;

    @render(Auth.AuthStore, (store) => store.system)
    storeAppType(appType: number) {
        this.appType = appType;
    }

    protected async showNoticeComponent(notice: gc.Notices.Notice) {
        await GameGuideUtils.hideWebViewGuide();
        const node = this.createNode();
        this.noticeCmp = node.getComponent(NoticeCmp);
        this.noticeCmp.setAppType(this.appType);
        this.noticeCmp.setData(notice);
    }

    @render(Notices.NoticeStore, (store) => store.notice)
    async showNotice(notice: gc.Notices.Notice) {
        if (!game.isPaused() && notice) {
            this.clearNoticeStore();
            await this.showNoticeComponent(notice);
        }
    }

    @handle(Notices.NoticeStore, (store) => store.addNotice(null))
    clearNoticeStore() { }

    @render(DisabledGame.DisabledGameStore, (store) => store.noticeDisable)
    async renderUMNotice(noticeDisable: gc.Notices.Notice) {
        if (!noticeDisable) {
            this.noticeCmp?.hide();
            return;
        }

        if (!this.noticeCmp?.node) {
            await this.showNoticeComponent(noticeDisable);
        }
    }
}
