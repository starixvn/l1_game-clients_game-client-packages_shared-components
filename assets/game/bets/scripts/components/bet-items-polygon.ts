import { EventTouch, Intersection2D, PolygonCollider2D, Vec2, _decorator } from "cc";
import BetItem from "./bet-item";
import { BetItems } from "./bet-items";
const { ccclass, property } = _decorator;

@ccclass
export class BetItemsPolygon extends BetItems {
    checkCollider(location: Vec2, collider: PolygonCollider2D) {
        return Intersection2D.pointInPolygon(location, collider.worldPoints);
    }

    handleBetItemClick(event: EventTouch) {
        const location = event.getUILocation();
        const betItem = this.node.children.find((item) => {
            const collider = item.getComponent(PolygonCollider2D);
            if (!collider) {
                return false;
            }
            return this.checkCollider(location, collider);
        });

        if (!betItem) {
            return;
        }
        betItem.getComponent(BetItem)?.callBet();
    }
}
