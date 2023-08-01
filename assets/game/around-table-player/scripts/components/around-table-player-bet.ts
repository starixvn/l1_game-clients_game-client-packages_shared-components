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

    protected durationAnimMove = 0.15;
    protected easingName: TweenEasing = "quintOut";
    protected originalPosition: math.Vec3 = null;

    protected onLoad(): void {
        this.originalPosition = this.node.position;
    }

    animMoveBet() {
        tween(this.node)
            .to(
                this.durationAnimMove,
                {
                    position: this.getPosition(),
                },
                { easing: this.easingName }
            )
            .to(
                this.durationAnimMove,
                {
                    position: v3(this.originalPosition.x, this.originalPosition.y, 0),
                },
                { easing: this.easingName }
            )

            .start();
    }

    protected getPosition() {
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
