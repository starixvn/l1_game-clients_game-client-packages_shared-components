import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { Dialog } from "../../dialogs/dialog";
const { ccclass, property } = _decorator;

enum NoticeType {
    Info = 0,
    Error = 1,
}

@ccclass()
export class NoticeCmp extends Dialog {
    @property(Sprite)
    containerBackground: Sprite = null;

    @property(Label)
    lblTitle: Label = null;

    @property(Label)
    lblMessage: Label = null;

    @property(SpriteFrame)
    errorBackground: SpriteFrame = null;

    @property(SpriteFrame)
    infoBackground: SpriteFrame = null;

    @property(Node)
    btnConfirm: Node = null;

    onClose: () => void;

    setData(data: { title: string; message: string; type: NoticeType; onClose: () => void; showBtnConfirmButton?: boolean }) {
        this.lblTitle.string = data.title.toUpperCase();
        this.lblMessage.string = data.message;
        this.onClose = data.onClose;
        this.updateDisplay(data.type, data.showBtnConfirmButton);
    }

    updateDisplay(type: NoticeType, showBtnConfirmButton?: boolean) {
        const isInfo = type === NoticeType.Info;
        this.setBackground(isInfo);
        this.btnConfirm.active = showBtnConfirmButton || isInfo;
    }

    setBackground(isInfo: boolean) {
        if (isInfo) {
            this.containerBackground.spriteFrame = this.infoBackground;
        } else {
            this.containerBackground.spriteFrame = this.errorBackground;
        }
    }

    onOkClick() {
        this.hide();
    }

    onDestroy() {
        this.onClose && this.onClose();
    }
}
