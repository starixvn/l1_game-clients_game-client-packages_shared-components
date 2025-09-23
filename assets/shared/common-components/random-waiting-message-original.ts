import gc from "@sg/game-client-base";
import { _decorator, Component, Label, tween, Tween, UIOpacity, v3 } from "cc";
import { shuffle } from "lodash-es";
import { RandomWaitingMessageLandscape } from "./random-waiting-message-landscape";
const { ccclass, property } = _decorator;

@ccclass
export class RandomWaitingMessageOriginal extends RandomWaitingMessageLandscape {
    currentIndex = 0;
    messageList = ["message_download_first_visit", "splash_check_downloading"];

    onLoad() {
        super.onLoad();
        this.messageList = shuffle(this.messageList);
        this.showMessage(0);
    }

    showMessage(duration = 1) {
        this.currentIndex++;
        if (this.currentIndex > this.messageList.length - 1) {
            this.currentIndex = 0;
        }
        this.setMessage(gc.Translator.commonTranslate(this.messageList[this.currentIndex]));
        const messageNode = this.messageLabel.node;
        messageNode.position = v3(messageNode.position.x, 0, 0);
        this.uiOpacity.opacity = 0;

        this.messageTween = tween(messageNode)
            .parallel(
                tween(this.uiOpacity).to(duration, { opacity: 255 }, { easing: "sineIn" })
            )
            .delay(this.displayMessageTime)
            .call(() => {
                this.hideMessage();
            })
            .start();
    }

    hideMessage() {
        this.messageTween = tween(this.messageLabel.node)
            .parallel(
                tween(this.uiOpacity).to(this.animationDuration, { opacity: 0 }, { easing: "sineOut" })
            )
            .call(() => {
                this.showMessage();
            })
            .start();
    }

    reset() {
        this.messageTween.stop();
        this.uiOpacity.opacity = 255;
        this.messageLabel.node.position = v3(0, 0, 0);
    }
}
