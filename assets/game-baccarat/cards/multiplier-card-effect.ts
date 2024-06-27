import { _decorator, Component, Node, tween } from "cc";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ComponentUtils } from "../../shared/utils";
import { BaccaratXCardsUI, CardEvent } from "./baccarat-x-cards-ui";
import { MultiplierCards } from "./multiplier-cards";
const { ccclass, property } = _decorator;

@ccclass
export class MultiplierCardEffect extends Component {
    @property(Node)
    nodeCardsUI: Node = null;

    @property(Node)
    nodeMultiplierCards: Node = null;

    @property(Node)
    nodeEffect: Node = null;

    cardsUI: BaccaratXCardsUI = null;
    multiplierCards: MultiplierCards = null;
    onLoad() {
        this.cardsUI = this.nodeCardsUI.getComponent(BaccaratXCardsUI);
        this.multiplierCards = this.nodeMultiplierCards.getComponent(MultiplierCards);

        this.cardsUI.node.on(CardEvent.OPENED_CARD, this.onOpenedCard, this);
    }

    onDestroy() {
        this.cardsUI.node.off(CardEvent.OPENED_CARD, this.onOpenedCard, this);
    }

    onOpenedCard(openCard: { card: FairnessCard; data: ServiceCard }) {
        const { card, data } = openCard;
        const matchedMultiplierCard = this.multiplierCards.findMatchedCard(data);
        if (matchedMultiplierCard) {
            console.log("matched multiplier");
            this.nodeEffect.active = true;
            const startPos = ComponentUtils.convertPosition(this.nodeEffect.parent, matchedMultiplierCard.node);
            const destPos = ComponentUtils.convertPosition(this.nodeEffect.parent, card.node);
            this.nodeEffect.position = startPos;
            tween(this.nodeEffect)
                .to(1, {
                    position: destPos,
                })
                .call(() => {
                    card.setGoldenCard();
                    this.nodeEffect.active = false;
                })
                .start();
        }
    }
}
