import { _decorator, Node, tween, v2, v3, Vec2 } from "cc";
import { ComponentUtils } from "../../utils/component-utils";
import DraggableItem from "./draggable-item";

const { ccclass, property } = _decorator;

@ccclass
export default class SafeDraggableItem extends DraggableItem {
    @property
    fixTopPadding = 0;

    start() {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.moveToEdge, this);
    }

    getCurrentSize(): Vec2 {
        const transform = ComponentUtils.getTransform(this.node);
        return v2(transform.width, transform.height);
    }

    onTouchEnd(e) {
        super.onTouchEnd(e);
        this.moveToEdge();
    }

    onTouchCancel(e) {
        super.onTouchCancel(e);
        this.moveToEdge();
    }

    moveToEdge() {
        const transform = ComponentUtils.getTransform(this.node.parent);
        const width = transform.width;
        const height = transform.height;
        const size = this.getCurrentSize();
        const maxX = width / 2 - size.x / 2;
        const maxY = height / 2 - size.y / 2;
        const deltaWidth = maxX - Math.abs(this.node.x);
        const deltaHeight = maxY - Math.abs(this.node.y);

        let posX: number, posY: number;
        if (deltaWidth < deltaHeight) {
            posY = this.node.y;
            posY = Math.min(Math.max(-maxY, posY), maxY);
            posX = this.node.x < 0 ? -maxX : maxX;
        } else {
            posX = this.node.x;
            posX = Math.min(Math.max(-maxX, posX), maxX);
            posY = this.node.y < 0 ? -maxY : maxY;
        }

        posY = Math.min(maxY - this.fixTopPadding, posY);
        tween(this.node)
            .to(0.3, { position: v3(posX, posY) }, { easing: "sineOut" })
            .start();
    }
}
