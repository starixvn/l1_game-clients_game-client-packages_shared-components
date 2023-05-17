import { _decorator, Button, EventTouch, Intersection2D, math, PolygonCollider2D } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export class PolygonButton extends Button {
    @property(PolygonCollider2D)
    polygonCollider2D: PolygonCollider2D = null;

    protected touchInPolygon(event: EventTouch) {
        const location = event.getUILocation();
        const polygon = this.polygonCollider2D.worldPoints;
        return Intersection2D.pointInPolygon(math.v2(location.x, location.y), polygon);
    }

    _onTouchBegan(event: EventTouch) {
        if (this.touchInPolygon(event)) {
            super._onTouchBegan(event);
        }
    }

    _onTouchMove(event) {
        if (this.touchInPolygon(event)) {
            super._onTouchMove(event);
        }
    }
}
