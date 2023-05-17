import { _decorator, Component, Label, math, tween, UIOpacity } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class WarningCmp extends Component {
    @property(Label)
    lblMessage: Label = null;

    onEnable() {
        this.autoDisappear();
    }

    autoDisappear() {
        const opacity = this.node.getComponent(UIOpacity);
        opacity.opacity = 0;
        const duration = 0.2;
        const delay = 0.5;
        tween(opacity).to(duration, { opacity: 255 }).delay(delay).to(duration, { opacity: 0 }).start();
        tween(this.node)
            .to(duration, {
                scale: math.Vec3.ONE,
            })
            .delay(delay)
            .to(duration, {
                scale: math.v3(1.5, 1.5),
            })
            .destroySelf()
            .start();
    }

    setData(message: string) {
        this.lblMessage.string = message;
    }
}
