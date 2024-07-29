import { _decorator, Component, instantiate, Node, sp } from "cc";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { AnimationUtils, ComponentUtils } from "../../shared/utils";
import { BaccaratXCardsUI } from "./baccarat-x-cards-ui";
import { MultiplierCards } from "./multiplier-cards";
const { ccclass, property } = _decorator;

@ccclass
export class LuckyCardEffect extends Component {
    @property(Node)
    nodeMultiplierCards: Node = null;

    @property(Node)
    nodeSpineEffect: Node = null;

    cardsUI: BaccaratXCardsUI = null;
    multiplierCards: MultiplierCards = null;
    onLoad() {
        this.multiplierCards = this.nodeMultiplierCards.getComponent(MultiplierCards);
    }

    async createEffectNode(golden: boolean, target: Node) {
        const node = instantiate(this.nodeSpineEffect);
        this.node.addChild(node);
        node.active = true;

        node.position = ComponentUtils.convertPosition(this.node, target);
        node.worldRotation = target.worldRotation;

        const spine = node.getComponent(sp.Skeleton);
        await AnimationUtils.playSpine(spine, golden ? "golden" : "white", false, 1.0);
        node.destroy();
    }

    async checkLuckyCard(openCard: { card: FairnessCard; data: ServiceCard; animated: boolean }) {
        const { card, data, animated } = openCard;
        const matchedMultiplierCard = this.multiplierCards.findMatchedCard(data, Math.floor(Math.random() * 8));
        if (matchedMultiplierCard) {
            const timeStamp = new Date().getTime();
            console.time(`anim white in ${timeStamp}`);
            animated && (await this.createEffectNode(false, matchedMultiplierCard.card.node));
            console.timeEnd(`anim white in ${timeStamp}`);
            matchedMultiplierCard.card.setGoldenCard(false, animated);

            if (animated) {
                console.time(`anim gold in ${timeStamp}`);
                this.createEffectNode(true, card.node).then(() => {
                    console.timeEnd(`anim gold in ${timeStamp}`);
                    card.setGoldenCard(true, animated);
                });
            } else {
                card.setGoldenCard(true, animated);
            }
        }
    }
}
