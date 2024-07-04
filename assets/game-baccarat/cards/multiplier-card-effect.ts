import { _decorator, Component, instantiate, Node, tween } from "cc";
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

    onOpenedCard(openCard: { card: FairnessCard; data: ServiceCard; animated: boolean }) {
        const { card, data, animated } = openCard;
        const matchedMultiplierCard = this.multiplierCards.findMatchedCard(data);
        if (matchedMultiplierCard) {
            if (animated) {
                const node = instantiate(this.nodeEffect);
                this.nodeEffect.parent.addChild(node);
                node.active = true;
                const startPos = ComponentUtils.convertPosition(node.parent, matchedMultiplierCard.node);
                const destPos = ComponentUtils.convertPosition(node.parent, card.node);
                node.position = startPos;
                tween(node)
                    .to(0.5, {
                        position: destPos,
                    })
                    .call(() => {
                        matchedMultiplierCard.card.setGoldenCard(false);
                        card.setGoldenCard();
                    })
                    .destroySelf()
                    .start();
            } else {
                matchedMultiplierCard.card.setGoldenCard(false);
                card.setGoldenCard();
            }
        }
    }
}
