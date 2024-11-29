import { Button, Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
const { ccclass, property } = _decorator;

import gc from "@sg/game-client-base";
import { NoticeCmp, NoticeType } from "../../../shared/common-components/notice/scripts/notice-cmp";

@ccclass()
export class NoticeDirectCmp extends NoticeCmp {
    setData(data: {
        title: string;
        message: string;
        type: NoticeType;
        onClose: () => void;
        showBtnConfirmButton?: boolean;
        noticeInfo?: gc.Notices.NoticeInfo;
    }) {
        const isHoldPopup =
            data.noticeInfo === gc.Notices.NoticeInfo.DisabledGame || data.noticeInfo === gc.Notices.NoticeInfo.LostGameConnection;
        if (isHoldPopup) {
            this.btnConfirm.active = false;
            const bgCpm = this.nodeFadeBackground?.getComponent(Button);
            bgCpm && (bgCpm.clickEvents = null);
        }

        super.setData(data);
    }
}
