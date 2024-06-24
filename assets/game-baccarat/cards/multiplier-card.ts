import { _decorator, Component, Label } from "cc";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { convertRank } from "../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;

@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(FairnessCard)
    cardFairness: FairnessCard = null;

    setData(card: any) {
        this.lblMultiplier.string = card.value;
        this.cardFairness.card.setCard({ rank: convertRank(card.rank), suit: card.suit });
        this.cardFairness.card.faceUp();
    }
}
