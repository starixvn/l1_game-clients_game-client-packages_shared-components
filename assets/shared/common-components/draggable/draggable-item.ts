import { _decorator, Component, EventTouch, Intersection2D, log, Node, PolygonCollider2D, v2, v3, Vec2 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class DraggableItem extends Component {
    @property({ type: PolygonCollider2D })
    colliders: PolygonCollider2D[] = [];

    @property(Node)
    targetNode: Node = null;

    get target(): Node {
        return this.targetNode ?? this.node;
    }

    private startPosition = v2(0, 0);
    private startTouchLocation = v2(0, 0);

    private isTouchStarted = false;

    public touchCallback = {
        start: (node: Node) => {},
        move: (touchPosition: Vec2) => {},
        end: (isClicked: boolean) => {},
    };

    checkCollider(event: EventTouch): boolean {
        if (this.colliders.length === 0) {
            return true;
        }

        const touchLocation = event.getUILocation();
        return this.colliders.some((collider) => Intersection2D.pointInPolygon(touchLocation, collider.worldPoints));
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(e: EventTouch) {
        if (!this.checkCollider(e)) {
            log("not touch in collider");
            return;
        }
        this.isTouchStarted = true;
        this.touchCallback.start(this.node);
        this.startPosition = v2(this.target.position.x, this.target.position.y);
        this.startTouchLocation = e.getLocation();
    }

    onTouchMove(e: EventTouch) {
        if (!this.isTouchStarted) {
            return;
        }
        const delta = v2(e.getLocation()).subtract(this.startTouchLocation);
        this.target.position = v3(delta.x + this.startPosition.x, delta.y + this.startPosition.y);
        this.touchCallback.move(e.getLocation());
    }

    onTouchEnd(e: EventTouch) {
        if (!this.isTouchStarted) {
            return;
        }
        this.isTouchStarted = false;
        this.touchCallback.end(e && this.isClicked(e));
    }

    isClicked(e: EventTouch): boolean {
        const delta = v2(e.getLocation()).subtract(this.startTouchLocation);
        return Math.abs(delta.x) + Math.abs(delta.y) < 10;
    }

    onTouchCancel() {
        if (!this.isTouchStarted) {
            return;
        }
        this.isTouchStarted = false;
        this.touchCallback.end(false);
    }
}
