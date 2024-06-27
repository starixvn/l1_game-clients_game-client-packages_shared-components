import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
import { PokerCard } from "./../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;
@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(PokerCard)
    card: PokerCard = null;

    data: gc.GameServiceMessage.BaccaratCardMultiplier;

    setData(card: gc.GameServiceMessage.BaccaratCardMultiplier) {
        this.data = card;
        this.lblMultiplier.string = `${card.value}x`;
        this.card.setServiceCard(card);
        this.card.faceUp();
        this.card.setGoldenCard();
    }
}
