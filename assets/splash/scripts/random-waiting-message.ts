import gc from "@sg/game-client-base";
import { Component, Label, Tween, UIOpacity, Vec3, _decorator, tween, v3 } from "cc";
import { shuffle } from "lodash-es";

const { ccclass, property } = _decorator;
const { Translator } = gc;

@ccclass
export class RandomWaitingMessage extends Component {
    @property(Label)
    lblMessage: Label = null;

    private readonly animationDuration = 1;
    private readonly displayMessageTime = 4;
    private readonly moveY = 35;
    currentIndex = 0;
    messageList = ["message_download_first_visit", "splash_check_downloading"];
    messageTweens: Tween<any>[] = [];

    onLoad() {
        this.messageList = shuffle(this.messageList);
        this.showMessage(0);
    }

    showMessage(duration = 1) {
        this.currentIndex++;
        if (this.currentIndex > this.messageList.length - 1) {
            this.currentIndex = 0;
        }
        this.setMessage(Translator.commonTranslate(this.messageList[this.currentIndex]));
        const nodeMessage = this.lblMessage.node;
        nodeMessage.setPosition(nodeMessage.getPosition().x, this.moveY);
        nodeMessage.getComponent(UIOpacity).opacity = 0;
        this.messageTweens.push(tween(nodeMessage).to(duration, { position: Vec3.ZERO }, { easing: "sineIn" }).start());
        this.messageTweens.push(
            tween(nodeMessage.getComponent(UIOpacity))
                .to(duration, { opacity: 255 }, { easing: "sineIn" })
                .delay(this.displayMessageTime)
                .call(() => {
                    this.clearAllTweens();
                    this.node.active && this.hideMessage();
                })
                .start()
        );
    }

    hideMessage() {
        const nodeMessage = this.lblMessage.node;
        this.messageTweens.push(
            tween(nodeMessage)
                .to(this.animationDuration, { position: v3(0, this.moveY, 0) }, { easing: "sineOut" })
                .start()
        );
        this.messageTweens.push(
            tween(nodeMessage.getComponent(UIOpacity))
                .to(this.animationDuration, { opacity: 0 }, { easing: "sineOut" })
                .delay(this.displayMessageTime)
                .call(() => {
                    this.clearAllTweens();
                    this.node.active && this.showMessage();
                })
                .start()
        );
    }

    clearAllTweens() {
        this.messageTweens = [];
    }

    reset() {
        this.messageTweens.forEach((t) => t.stop());
        this.lblMessage.node.getComponent(UIOpacity).opacity = 255;
        this.lblMessage.node.position = Vec3.ZERO;
    }

    setMessage(message: string) {
        this.lblMessage.string = message;
    }
}
