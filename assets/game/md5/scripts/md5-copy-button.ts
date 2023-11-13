import gc from "@sg/game-client-base";
import { Label, Node, UIOpacity, _decorator, tween } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { Translator } = gc;

@ccclass
export class Md5CopyButton extends ObserverComponent {
    @property(Node)
    nodeHintCopy: Node = null;
    public isCopying = false;
    protected lblHint: Label = null;

    onLoad() {
        if (this.nodeHintCopy) {
            this.lblHint = this.nodeHintCopy.getChildByName("content").getComponent(Label);
            this.lblHint.string = Translator.commonTranslate("copy_successfully_md5");
        }
        window.addEventListener("message", this.registerEventCopyMD5.bind(this));
    }

    onDestroy(): void {
        super.onDestroy();
        window.removeEventListener("message", this.registerEventCopyMD5.bind(this));
    }

    private registerEventCopyMD5(event: MessageEvent) {
        const success = event.data.copySuccessfully;
        if (success !== undefined && this.isCopying) {
            this.isCopying = false;
            const key = this.isCopying ? "copy_successfully_md5" : "copy_failed_md5";
            this.lblHint.string = gc.Translator.commonTranslate(key);
            this.showHint();
        }
    }

    private showHint() {
        if (this.nodeHintCopy) {
            tween(this.nodeHintCopy.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(3).to(0.1, { opacity: 1 }).start();
        }
    }
}
