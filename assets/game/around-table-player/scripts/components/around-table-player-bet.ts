import { Component, TweenEasing, _decorator, math, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AroundTablePlayerBet")
export class AroundTablePlayerBet extends Component {
    @property
    direction = 1;

    @property
    isXAxis = true;

    @property
    stepMove = 5;

    protected duration = 0.3;
    protected durationAnimMove = 0.15;
    protected easingStart: TweenEasing = "quintOut";
    protected easingEnd: TweenEasing = "quintOut";
    protected originalPosition: math.Vec3 = null;

    protected onLoad(): void {
        this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);
    }

    animMoveBet() {
        tween(this.node)
            .to(
                this.durationAnimMove,
                {
                    position: this.getPosition(),
                },
                { easing: this.easingStart }
            )
            .delay(this.duration - this.durationAnimMove * 2)
            .to(
                this.durationAnimMove,
                {
                    position: v3(this.originalPosition.x, this.originalPosition.y, 0),
                },
                { easing: this.easingStart }
            )

            .start();
    }

    getPosition() {
        let x = this.originalPosition.x;
        let y = this.originalPosition.y;
        if (this.isXAxis) {
            x += this.stepMove * this.direction;
        } else {
            y += this.stepMove * this.direction;
        }

        return v3(x, y, 0);
    }
}
