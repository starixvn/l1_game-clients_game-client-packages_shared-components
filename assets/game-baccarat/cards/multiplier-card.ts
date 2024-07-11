import { _decorator, Component, Label } from "cc";
import { PokerCard, ServiceCard } from "./../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;
@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(PokerCard)
    card: PokerCard = null;

    data: ServiceCard;

    setData(data: { item: ServiceCard; value: number }) {
        this.data = data.item;
        this.lblMultiplier.string = `${data.value}x`;
        this.card.setServiceCard(this.data);
        this.card.faceUp();
        this.card.setGoldenCard(true, false);
    }
}
