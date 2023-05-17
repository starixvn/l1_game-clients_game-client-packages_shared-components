import { _decorator, Label, Node } from "cc";
import { Dialog } from "../../dialogs/dialog";
const { ccclass, property } = _decorator;

enum NoticeType {
    Info = 0,
    Error = 1,
}

@ccclass()
export class NoticeCmp extends Dialog {
    @property(Label)
    lblTitle: Label = null;

    @property(Label)
    lblMessage: Label = null;

    @property(Node)
    nodeInfo: Node = null;

    @property(Node)
    nodeError: Node = null;

    onClose: () => void;

    setData(data: { title: string; message: string; type: NoticeType; onClose: () => void }) {
        this.lblTitle.string = data.title;
        this.lblMessage.string = data.message;
        this.onClose = data.onClose;
        this.updateDisplay(data.type);
    }

    updateDisplay(type: NoticeType) {
        const isInfo = type === NoticeType.Info;
        this.nodeInfo.active = isInfo;
        this.nodeError.active = !isInfo;
    }

    onOkClick() {
        this.hide();
    }

    onDestroy() {
        this.onClose && this.onClose();
    }
}
