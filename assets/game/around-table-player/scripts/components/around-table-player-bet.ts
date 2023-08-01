import { Component, TweenEasing, _decorator, math, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AroundTablePlayerBet")
export class AroundTablePlayerBet extends Component {
    @property
    direction = 1;

    @property
    isXAxis = true;

    protected duration = 0.5;
    protected durationAnimMove = 0.2;
    protected stepMove = 20;
    protected easingStart: TweenEasing = "sineOut";
    protected easingEnd: TweenEasing = "sineIn";
    protected originalPosition: math.Vec3 = null;

    protected onLoad(): void {
        this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);
    }

    animMoveBet() {
        console.log("animMoveBet------");
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
