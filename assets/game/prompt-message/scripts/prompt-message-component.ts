import { Label, UIOpacity,  _decorator, tween, math, Component } from "cc";
const { ccclass, property } = _decorator;
import gc from "@sg/game-client-base";
const { LocalizedUtils } = gc;


@ccclass
export default class PromptMessageComponent extends Component {
  @property({ type: Label })
  protected resultText: Label = null;  

  start() {
    this.node.getComponent(UIOpacity).opacity = 0;
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
    tween(opacity).to(duration, { opacity: 255 }).delay(delay).to(duration, { opacity: 0 }).start();
    tween(this.node)
        .to(duration, {
            scale: math.Vec3.ONE,
        })
        .delay(delay)
        .to(duration, {
            scale: math.v3(1.5, 1.5),
        })
        .start();
}

  showStartBetMessage() {
    const message = LocalizedUtils.getLocalizedText("startPlaceBet").toUpperCase();
    this.content = message;
  }

  showStopBetMessage() {
    const message = LocalizedUtils.getLocalizedText("stopPlaceBet").toUpperCase();
    this.content = message;
  }
}
