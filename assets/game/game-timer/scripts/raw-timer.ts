import { _decorator, Component, Node, tween, v3 } from "cc";
import { AnimationUtils } from "../../../shared/utils";

const { ccclass, property } = _decorator;

@ccclass()
export default class RawTimer extends Component {
    @property
    height = 0;

    @property
    bounceYOffest = 0;

    @property
    animated = true;

    setTime(time: number) {
        console.warn("RawTimer setTime", time);
    }
    protected handleBetTimeAnimation(node: Node) {
        if (this.animated) {
            node.position = v3(node.position.x, this.height);
            tween(node)
                .to(0.3, {
                    position: v3(node.position.x, -this.bounceYOffest),
                })
                .to(0.1, {
                    position: v3(node.position.x, 0),
                })
                .start();

            AnimationUtils.fadeIn(node, 0.2, 255);
        }
    }
}
