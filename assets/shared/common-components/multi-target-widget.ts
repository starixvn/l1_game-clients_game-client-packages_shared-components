import { _decorator, Component, Node, UITransform, v3 } from "cc";
import { ComponentUtils } from "../utils/component-utils";
const { ccclass, property } = _decorator;

@ccclass("MultiTargetWidget")
export class MultiTargetWidget extends Component {
    @property(Node)
    top: Node = null;

    @property(Node)
    left: Node = null;

    @property(Node)
    right: Node = null;

    @property(Node)
    bottom: Node = null;

    onLoad() {
        this.top.on(Node.EventType.TRANSFORM_CHANGED, this.updateAlignment, this);
        this.left.on(Node.EventType.TRANSFORM_CHANGED, this.updateAlignment, this);
        this.right.on(Node.EventType.TRANSFORM_CHANGED, this.updateAlignment, this);
        this.bottom.on(Node.EventType.TRANSFORM_CHANGED, this.updateAlignment, this);
    }
    
    updateAlignment() {
        const transform = this.node.getComponent(UITransform);
        const topWP = this.top.worldPosition;
        const leftWP = this.left.worldPosition;
        const rightWP = this.right.worldPosition;
        const bottomWP = this.bottom.worldPosition;

        const width = Math.abs(rightWP.x - leftWP.x);
        const height = Math.abs(topWP.y - bottomWP.y);

        const wPos = v3(leftWP.x + transform.anchorX * width, topWP.y - transform.anchorY * height, 0);
        this.node.worldPosition = wPos;
        ComponentUtils.setNodeTransform(this.node, { width, height });
    }
}
