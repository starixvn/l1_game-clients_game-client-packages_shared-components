import { _decorator, Node } from "cc";
import { PokerCard } from "../../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;

@ccclass
export class FairnessPokerCard extends PokerCard {
    @property(Node)
    nodeHighlight: Node = null;

    showHighlight(isShow: boolean) {
        this.nodeHighlight.active = isShow;
    }
}
