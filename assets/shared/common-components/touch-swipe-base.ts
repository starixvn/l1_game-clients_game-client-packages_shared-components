import { _decorator, Component, EventTouch, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class TouchSwipeBase extends Component {
    private readonly MIN_SWIPE_DISTANCE = 80;
    private readonly MAX_VERTICAL_DISTANCE = 80;

    public swipeCallback = (isLeft: boolean) => { };

    onLoad() {
        this.registerTouchEvents();
    }

    onDestroy() {
        this.clearTouchEvents();
    }

    registerTouchEvents() {
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    clearTouchEvents() {
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    onTouchMove(event: EventTouch) {
        // Prevent button click events during swipe
        const startLocation = event.getStartLocation();
        const currentLocation = event.getLocation();
        const touchDiffX = currentLocation.x - startLocation.x;
        const touchDiffY = currentLocation.y - startLocation.y;
        const absX = Math.abs(touchDiffX);
        const absY = Math.abs(touchDiffY);

        // If vertical movement is greater than horizontal, treat as scroll
        if (absY > absX) {
            return;
        }

        // If vertical distance exceeds maximum, prevent swipe
        if (absY > this.MAX_VERTICAL_DISTANCE) {
            return;
        }

        // Only trigger swipe if horizontal movement is dominant and sufficient
        if (absX > this.MIN_SWIPE_DISTANCE && absY <= this.MAX_VERTICAL_DISTANCE) {
            this.swipeCallback(touchDiffX < 0);
        }
    }
}
