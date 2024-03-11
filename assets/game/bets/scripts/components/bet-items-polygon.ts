import { Intersection2D, PolygonCollider2D, Vec2, _decorator } from "cc";
import BetItem from "./bet-item";
import { BetItems } from "./bet-items";
const { ccclass, property } = _decorator;

@ccclass
export class BetItemsPolygon extends BetItems {
    checkCollider(location: Vec2, collider: PolygonCollider2D) {
        return Intersection2D.pointInPolygon(location, collider.worldPoints);
    }

    handleBetItemClick(event) {
        const location = event.getLocation();
        const betItem = this.node.children.find((item) => this.checkCollider(location, item.getComponent(PolygonCollider2D)));

        if (!betItem) {
            return;
        }
        console.log(betItem.name);
        betItem.getComponent(BetItem).onBet();
    }
}
