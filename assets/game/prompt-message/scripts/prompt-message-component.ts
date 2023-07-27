import gc from "@sg/game-client-base";
import { Component, Label, UIOpacity, _decorator, tween, v3 } from "cc";
const { ccclass, property } = _decorator;
const { Translator } = gc;

@ccclass
export default class PromptMessageComponent extends Component {
    @property({ type: Label })
    protected resultText: Label = null;

    start() {
        this.node.getComponent(UIOpacity).opacity = 0;
        console.log("tấds this.node.position.xthis.node.position.x", this.node.position.x);
    }

    set content(value: string) {
        this.show(value);
    }

    protected show(text: string) {
        this.resultText.string = text;
        this.prompt();
    }

    prompt() {
        const opacity = this.node.getComponent(UIOpacity);
        opacity.opacity = 1;
        const duration = 0.2;
        const delay = 1.5;
        const firstXPosition = this.node.position.x;
        tween(opacity)
            .to(duration, { opacity: 255 }, { easing: "circIn" })
            .delay(delay)
            .to(duration, { opacity: 0 }, { easing: "circOut" })
            .start();
        tween(this.node)
            .to(
                duration,
                {
                    position: v3(0, 0, 0),
                },
                { easing: "circIn" }
            )
            .delay(delay)
            .to(
                duration,
                {
                    position: v3(Math.abs(firstXPosition), 0, 0),
                },
                { easing: "circOut" }
            )
            .delay(duration)
            .to(duration, {
                position: v3(firstXPosition, 0, 0),
            })
            .start();
    }

    showStartBetMessage() {
        const message = Translator.commonTranslate("message_place_bets").toUpperCase();
        this.content = message;
    }

    showStopBetMessage() {
        const message = Translator.commonTranslate("message_stop_bet").toUpperCase();
        this.content = message;
    }
}
