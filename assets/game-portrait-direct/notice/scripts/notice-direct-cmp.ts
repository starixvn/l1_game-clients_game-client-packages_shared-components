import { Button, _decorator } from "cc";
const { ccclass } = _decorator;

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
        const notToHidePopup =
            data.noticeInfo === gc.Notices.NoticeInfo.DisabledGame || data.noticeInfo === gc.Notices.NoticeInfo.LostGameConnection;
        if (notToHidePopup) {
            const bgCpm = this.nodeFadeBackground?.getComponent(Button);
            bgCpm && (bgCpm.clickEvents = []);
            data.showBtnConfirmButton = false;
        }

        super.setData(data);
    }
}
