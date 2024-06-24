import gc from "@sg/game-client-base";
import { Node, Prefab, UITransform, Vec3, _decorator, instantiate, sp, tween, v3 } from "cc";
import Observer from "observer";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "../../shared/utils/utils";
import { BaccaratXCards } from "./baccarat-x-cards";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, GameBaccaratX } = gc;

type ServiceCardHand = {
    card1: ServiceCard;
    card2: ServiceCard;
    card3?: ServiceCard;
    score: number;
};

type BaccaratResult = {
    [choice: string]: ServiceCardHand;
};

type PoolItem = {
    location: number;
    card: FairnessCard;
};

enum CardLocation {
    Box = 0,
    Player1 = 1,
    Banker1 = 2,
    Player2 = 3,
    Banker2 = 4,
    Waiting1 = 5,
    Waiting2 = 6,
    Player3,
    Banker3,
    Trash = 9,
}

@ccclass
export class BaccaratXCardsUI extends ObserverComponent {
    @property(Prefab)
    prfCard: Prefab = null;

    @property(Node)
    nodeCardContainer: Node = null;

    @property(Node)
    nodeWaitingCard: Node = null;

    @property(Node)
    nodeBoxCard: Node = null;

    @property(Node)
    nodeTrash: Node = null;

    @property(sp.Skeleton)
    spineCutCard: sp.Skeleton = null;

    private _cardHands: BaccaratXCards[] = [];

    currentCardIndex = -1;

    cards: FairnessCard[] = [];

    cardPool: PoolItem[] = [];

    onLoad() {
        super.onLoad();
    }

    async initCards() {
        for (let i = 0; i < 6; i++) {
            const node = instantiate(this.prfCard);
            this.nodeCardContainer.addChild(node);
            node.setScale(v3(0.4, 0.4));
            // node.active = false;
            const card = node.getComponent(FairnessCard);
            this.cardPool.push({
                location: CardLocation.Box,
                card,
            });
        }
        await this.draw6Cards(false);
    }

    get cardHands() {
        if (this._cardHands.length === 0) {
            this._cardHands = this.getComponentsInChildren(BaccaratXCards);
        }
        return this._cardHands;
    }

    hasWaitingCards(): boolean {
        return this.cardPool.find((card) => card.location === CardLocation.Waiting1 || card.location === CardLocation.Waiting2) !== null;
    }

    getItemAtLocation(location: number): PoolItem {
        return this.cardPool.find((card) => card.location === location);
    }

    updateLocation(item: PoolItem, location: number) {
        item.location = location;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    async closeCards(isStartingRound) {
        this.cardHands.forEach((comp) => {
            comp.showScore(false);
        });
        if (isStartingRound) {
            if (this.hasWaitingCards()) {
                const waitingCards = this.cardPool.filter(
                    (card) => card.location === CardLocation.Waiting1 || card.location === CardLocation.Waiting2
                );
                const others = this.cardPool.filter(
                    (card) => card.location !== CardLocation.Waiting1 && card.location !== CardLocation.Waiting2
                );

                await this.dropCards(others, true);
                this.resetCardsToBox(others);

                const pool = [...waitingCards, ...others];
                this.cards = pool.map((item) => item.card);
                await this.drawingCards(pool, true);
                this.currentCardIndex += others.length;
            } else {
                await this.draw6Cards(true);
                this.currentCardIndex += this.cardPool.length;
            }
            console.log(`increase currentCardIndex `, this.currentCardIndex);
        }
    }

    private async draw6Cards(animated = true) {
        await this.dropCards(this.cardPool, animated);
        this.resetCardsToBox(this.cardPool);
        this.cards = this.cardPool.map((item) => item.card);
        await this.drawingCards(this.cardPool, animated);
    }

    async dropCards(cards: PoolItem[], animated = true) {
        for (const item of cards) {
            await this.moveCard(item.card.node, CardLocation.Trash, animated);
            this.updateLocation(item, CardLocation.Trash);
        }
    }

    resetCardsToBox(pool: PoolItem[]) {
        pool.forEach((item) => {
            item.card.card.faceDown();
            item.location = CardLocation.Box;
            this.moveCard(item.card.node, CardLocation.Box, false);
        });
    }

    async drawingCards(cards: PoolItem[], animated = true) {
        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];
            const nextLocation = i + 1;
            item.card.setIndexValue(this.currentCardIndex + i);
            await this.moveCard(item.card.node, nextLocation, animated);
            this.updateLocation(item, nextLocation);
        }
    }

    getPosition(location: number) {
        let node: Node;
        switch (location) {
            case CardLocation.Player1:
            case CardLocation.Player2:
            case CardLocation.Player3:
                node = this.cardHands[0].getCardLocation(Math.floor(location / 3));
                break;
            case CardLocation.Banker1:
            case CardLocation.Banker2:
            case CardLocation.Banker3:
                node = this.cardHands[1].getCardLocation(Math.floor(location / 3));
                break;

            case CardLocation.Waiting1:
            case CardLocation.Waiting2:
                node = this.nodeWaitingCard.children[location - CardLocation.Waiting1];
                break;

            case CardLocation.Box:
                node = this.nodeBoxCard;
                break;
            case CardLocation.Trash:
                node = this.nodeTrash;
                break;
            default:
                break;
        }
        return node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
    }

    async moveCard(card: Node, nextLocation: number, animated: boolean) {
        const nextPosition = this.nodeCardContainer.getComponent(UITransform).convertToNodeSpaceAR(this.getPosition(nextLocation));
        await this.moveCardAnimation(card, nextPosition, animated);
    }

    moveCardAnimation(node: Node, position: Vec3, animated) {
        if (!animated) {
            node.position = position;
            return;
        }

        return new Promise((resolve) => {
            const duration = 0.5;
            tween(node)
                .to(duration, {
                    position,
                })
                .call(resolve)
                .start();
        });
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    renderShoeInfo(shoeInfo: gc.GameServiceMessage.ShoeInfo) {
        if (shoeInfo) {
            this.currentCardIndex = shoeInfo.currentIndex ?? shoeInfo.burnedCards;
            console.log(`received current index`, this.currentCardIndex);
        }
    }

    async openCards(result: BaccaratResult, animated = true) {
        const dataCards = [];
        for (let i = 0; i < 3; i++) {
            [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team) => {
                const handData = result[team];
                dataCards.push(handData[`card${i + 1}`]);
            });
        }

        let index = 0;
        if (this.cards.length === 0) {
            await this.initCards();
        }
        for (const [dataIndex, data] of dataCards.entries()) {
            if (data) {
                const card = this.cards[index];
                card.setCardData(data);
                if (index > 3) {
                    const newLocation = dataIndex === 4 ? CardLocation.Player3 : CardLocation.Banker3;
                    await this.moveCard(card.node, newLocation, animated);
                    // update remove from waiting cards
                    const item = this.cardPool.find((item) => item.card === card);
                    item.location = newLocation;
                }
                await card.openCard(animated);
                index++;
            }
        }

        [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team, index) => {
            const handData = result[team];
            const comp = this.cardHands[index];
            comp.setScore(handData.score);
        });
    }

    // @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    async startNewShoe(shoeInfo: gc.GameServiceMessage.ShoeInfo) {
        if (!shoeInfo) {
            return;
        }
        const { firstCard, burnedCards } = shoeInfo;
        await this.playAnimationCutCard();
    }

    async playAnimationCutCard() {
        await AnimationUtils.playSpine(this.spineCutCard, this.spineCutCard.animation, false);
    }

    async playAnimationBurnCards(firstCard, burnedCards: number) {}
}
