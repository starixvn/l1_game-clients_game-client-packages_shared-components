import { _decorator, Component, instantiate, Node, tween, v3 } from "cc";
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
    testIndex = 0;
    onLoad() {
        this.cardsUI = this.nodeCardsUI.getComponent(BaccaratXCardsUI);
        this.multiplierCards = this.nodeMultiplierCards.getComponent(MultiplierCards);

        this.nodeCardsUI.on(CardEvent.OPENED_CARD, this.onOpenedCard, this);
    }

    onDestroy() {
        this.nodeCardsUI && this.nodeCardsUI.isValid && this.nodeCardsUI.off(CardEvent.OPENED_CARD, this.onOpenedCard, this);
    }

    onOpenedCard(openCard: { card: FairnessCard; data: ServiceCard; animated: boolean }) {
        const { card, data, animated } = openCard;
        const matchedMultiplierCard = this.multiplierCards.findMatchedCard(data);
        this.testIndex++;
        if (matchedMultiplierCard) {
            const changeToGoldCard = () => {
                matchedMultiplierCard.card.setGoldenCard(false, animated);
                card.setGoldenCard(true, animated);
            };
            if (animated) {
                const node = instantiate(this.nodeEffect);
                this.nodeEffect.parent.addChild(node);
                node.active = true;
                const startPos = ComponentUtils.convertPosition(node.parent, matchedMultiplierCard.node);
                const cardTransform = ComponentUtils.getTransform(card.node);

                const eulerAngles = card.node.eulerAngles;
                const isRotated = eulerAngles.z !== 0;
                const offset = isRotated ? v3(((eulerAngles.z / 90) * cardTransform.width) / 2, 0) : v3(0, cardTransform.height / 2);
                const destPos = ComponentUtils.convertPosition(node.parent, card.node, offset);
                node.position = startPos;

                tween(node)
                    .to(0.5, {
                        position: destPos,
                    })
                    .call(() => {
                        changeToGoldCard();
                    })
                    .delay(0.2)
                    .destroySelf()
                    .start();
            } else {
                changeToGoldCard();
            }
        }
    }
}
