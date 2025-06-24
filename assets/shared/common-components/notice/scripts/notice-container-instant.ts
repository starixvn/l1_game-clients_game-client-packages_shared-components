import gc from "@sg/game-client-base";
import { _decorator, director, game } from "cc";
import Observer from "observer";
import { NoticeContainer } from "./notice-container";
import Splash from "db://shared-components/splash/scripts/components/splash";

const { render } = Observer;

const { Notices, DisabledGame } = gc;
const { ccclass } = _decorator;

@ccclass("NoticeContainerInstant")
export class NoticeContainerInstant extends NoticeContainer {
    @render(DisabledGame.DisabledGameStore, (store) => store.noticeDisable)
    override async renderUMNotice(noticeDisable: gc.Notices.Notice) {
        if (!noticeDisable) {
            this.noticeCmp?.hide();
            return;
        }

        if (!this.noticeCmp?.node) {
            await this.showNoticeComponent(noticeDisable);
            const splashComponent = director.getScene()?.getComponentInChildren(Splash);
            if (splashComponent) {
                splashComponent.loadSceneGame();
            }
        }
    }
}
