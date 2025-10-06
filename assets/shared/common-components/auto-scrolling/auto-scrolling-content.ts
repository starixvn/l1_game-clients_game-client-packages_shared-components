import { _decorator, Component, tween, Tween, v3 } from "cc";
import Observer from "observer";
import { ComponentUtils } from "../../utils";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export class AutoScrollingContent extends Component {
    @property
    scrollingSpeed = 200;

    @property
    delayAtBegining = 1;

    @property
    delayAtEnding = 1;


    private tweenScrolling: Tween;

    updateScrolling() {
        if (this.node.children.length === 0) {
            return;
        }

        if (this.tweenScrolling) {
            this.tweenScrolling.stop();
            this.tweenScrolling = null;
        }

        const childNode = this.node.children[0];
        const childTransform = ComponentUtils.getTransform(childNode);
        const textWidth = childTransform.width * childNode.scale.x;

        const containerTransform = ComponentUtils.getTransform(this.node);
        const containerWidth = containerTransform.width * this.node.scale.x;

        const activeScrolling = textWidth > containerWidth;
        if (activeScrolling) {
            const startX = -(containerTransform.anchorX * containerWidth) + (childTransform.anchorX * textWidth);
            const destX = startX - textWidth + containerWidth;
            const duration = -(destX - startX) / this.scrollingSpeed;
            this.tweenScrolling = tween(childNode)
                .repeatForever(tween()
                    .call(() => {
                        childNode.position = v3(startX, 0, 0);
                    })
                    .delay(this.delayAtBegining)
                    .to(duration, {
                        position: v3(destX, 0, 0),
                    })
                    .delay(this.delayAtEnding))
                .start();
        } else {
            const center = -(containerTransform.anchorX * containerWidth) + 0.5 * containerWidth
                + (childTransform.anchorX * textWidth) - 0.5 * textWidth;

            childNode.position = v3(center, 0, 0);
        }
    }

}