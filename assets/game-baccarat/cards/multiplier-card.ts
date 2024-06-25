import { _decorator, Component, Label } from "cc";
import { convertRank } from "../../game/poker-cards/scripts/poker-card";
import { PokerCard } from "./../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;

@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(PokerCard)
    card: PokerCard = null;

    setData(card: any) {
        this.lblMultiplier.string = card.value;
        this.card.setCard({ rank: convertRank(card.rank), suit: card.suit });
        this.card.faceUp();
    }
}
