import gc from "@sg/game-client-base";
import { Node, Prefab, UITransform, Vec3, _decorator, instantiate, sp, tween, v3 } from "cc";
import Observer from "observer";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { bundleManager } from "../../shared/common-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils, FunctionUtils } from "../../shared/utils";
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
    Center,
}

export enum CardEvent {
    OPENED_CARD = "OPENED_CARD",
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

    @property(Node)
    nodeBurnCards: Node = null;

    @property
    spineCutCardPath = "";

    private _cardHands: BaccaratXCards[] = [];
    private readonly movingCardDuration = 0.5;

    currentCardIndex = -1;

    cards: FairnessCard[] = [];

    cardPool: PoolItem[] = [];

    spineCutCard: sp.Skeleton = null;
    isNewShoe = false;

    async onLoad() {
        await this.initCards();
        super.onLoad();
    }

    test() {
        this.isNewShoe = true;
        this.scheduleOnce(() => {
            this.startNewShoe({
                cutCardIndex: 130,
                currentIndex: 6,
                firstCard: {
                    rank: 5,
                    suit: 2,
                },
                burnedCards: 6,
            });
        }, 2);
    }

    test2() {
        this.currentCardIndex = 6;
        this.closeCards(true);
    }

    async initSpineCutCard() {
        if (!this.spineCutCard) {
            const data = await bundleManager.loadAssetsFromBundle<sp.SkeletonData>(
                "resources",
                this.spineCutCardPath,
                sp.SkeletonData,
                null
            );
            const node = new Node();
            this.nodeBurnCards.addChild(node);
            this.spineCutCard = node.addComponent(sp.Skeleton);
            this.spineCutCard.skeletonData = data;
        }
    }

    async initCards() {
        if (this.cardPool.length > 0) {
            return;
        }
        for (let i = 0; i < 6; i++) {
            const node = this.creatNewCardNode();
            this.nodeCardContainer.addChild(node);
            node.active = false;
            const card = node.getComponent(FairnessCard);
            this.cardPool.push({
                location: CardLocation.Box,
                card,
            });
            this.transformCardNode(node, CardLocation.Box, false);
        }
        this.cards = this.cardPool.map((item) => item.card);
    }

    private creatNewCardNode() {
        const node = instantiate(this.prfCard);
        node.setScale(v3(0.4, 0.4));
        return node;
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

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound, { fireImmediately: false })
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

    async draw6Cards(animated = true) {
        await this.dropCards(this.cardPool, animated);
        this.resetCardsToBox(this.cardPool);
        this.cards = this.cardPool.map((item) => item.card);
        await this.drawingCards(this.cardPool, animated);
    }

    async dropCards(cards: PoolItem[], animated = true) {
        for (const item of cards) {
            await item.card.closeCard(animated ? this.movingCardDuration / 2 : 0);
            await this.moveCard(item.card.node, CardLocation.Trash, animated);
            item.card.node.active = false;
            this.updateLocation(item, CardLocation.Trash);
        }
    }

    resetCardsToBox(pool: PoolItem[]) {
        pool.forEach((item) => {
            item.card.card.faceDown();
            item.location = CardLocation.Box;
            this.moveCard(item.card.node, CardLocation.Box, false);
            item.card.node.active = false;
        });
    }

    async drawingCards(cards: PoolItem[], animated = true) {
        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];
            const nextLocation = i + 1;
            item.card.node.active = true;
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
        this.transformCardNode(card, nextLocation, animated);
        await this.moveCardAnimation(card, nextPosition, animated);
    }

    moveCardAnimation(node: Node, position: Vec3, animated) {
        if (!animated) {
            node.position = position;
            return;
        }

        return new Promise((resolve) => {
            const duration = this.movingCardDuration;
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
        if (this.cards.length === 0) {
            await this.initCards();
        }
        const dataCards: ServiceCard[] = [];
        for (let i = 0; i < 3; i++) {
            [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team) => {
                const handData = result[team];
                dataCards.push(handData[`card${i + 1}`]);
            });
        }

        let index = 0;
        for (const [dataIndex, data] of dataCards.entries()) {
            if (data) {
                const card = this.cards[index];
                card.node.active = true;
                card.setCardData(data);
                if (index > 3) {
                    const newLocation = dataIndex === 4 ? CardLocation.Player3 : CardLocation.Banker3;
                    await this.moveCard(card.node, newLocation, animated);
                    // update remove from waiting cards
                    const item = this.cardPool.find((item) => item.card === card);
                    item.location = newLocation;
                }
                await card.openCard(animated);
                this.node.emit(CardEvent.OPENED_CARD, { card, data });
                index++;
            }
        }

        [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team, index) => {
            const handData = result[team];
            const comp = this.cardHands[index];
            comp.setScore(handData.score);
        });
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoeHash, { fireImmediately: false })
    receivedNewShoe(newShoeHash: gc.GameServiceMessage.NewShoeHash) {
        if (newShoeHash) {
            this.isNewShoe = true;
        }
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    async startNewShoe(shoeInfo: gc.GameServiceMessage.ShoeInfo) {
        if (!shoeInfo || !this.isNewShoe) {
            return;
        }
        const { firstCard, burnedCards } = shoeInfo;
        this.dropCards(this.cardPool, false);
        //TODO: clear UI when new shoe
        await this.playAnimationCutCard();
        await this.playAnimationBurnCards(firstCard, burnedCards);
    }

    async playAnimationCutCard() {
        await this.initSpineCutCard();
        this.spineCutCard.node.active = true;
        await AnimationUtils.playSpine(this.spineCutCard, "cut-card", false);
        await FunctionUtils.delay(0.5);
        this.spineCutCard.node.active = false;
    }

    async playAnimationBurnCards(firstCard, burnedCards: number) {
        let cardNodes = [];
        const node = this.creatNewCardNode();
        const firstCardComp = node.getComponent(FairnessCard);
        firstCardComp.setIndexValue(1);
        firstCardComp.setCardData(firstCard);
        this.nodeBurnCards.addChild(node);

        node.position = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeBoxCard);
        cardNodes.push(node);

        firstCardComp.openCard();

        this.transformCardNode(node, CardLocation.Box, false);
        await this.moveCardAnimation(node, v3(0, 0, 0), true);

        await FunctionUtils.delay(2);

        const spacingFirstCard = 50;
        const spacingBurnedCards = 10;

        const cardWidth = 60;
        const firstCardsX = -0.5 * (cardWidth + spacingFirstCard + (cardWidth + spacingBurnedCards) * burnedCards - spacingBurnedCards);

        this.transformCardNode(node, CardLocation.Center);
        await this.moveCardAnimation(node, v3(firstCardsX + cardWidth / 2, 0, 0), true);

        const startX = firstCardsX + cardWidth + spacingFirstCard;
        const moreCards = burnedCards - 1;
        for (let i = 0; i < moreCards; i++) {
            const node = this.creatNewCardNode();
            const cardComp = node.getComponent(FairnessCard);
            cardComp.setIndexValue(1 + i);
            this.nodeBurnCards.addChild(node);
            node.position = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeBoxCard);
            this.transformCardNode(node, CardLocation.Box, false);
            this.transformCardNode(node, CardLocation.Center);
            await this.moveCardAnimation(node, v3(startX + i * (cardWidth + spacingBurnedCards) + cardWidth / 2, 0, 0), true);
            cardNodes.push(node);
        }

        await FunctionUtils.delay(1);

        const dropPosition = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeTrash);
        for (let i = 0; i < cardNodes.length; i++) {
            const node = cardNodes[i];
            this.transformCardNode(node, CardLocation.Trash);
            await this.moveCardAnimation(node, dropPosition, true);
            node.destroy();
        }

        cardNodes = [];
    }

    transformCardNode(node: Node, location: CardLocation, animated = true) {
        let scale: Vec3;
        let eulerAngles: Vec3;
        switch (location) {
            case CardLocation.Trash:
                eulerAngles = this.nodeTrash.eulerAngles;
                scale = this.nodeTrash.scale;
                break;
            case CardLocation.Box:
                eulerAngles = this.nodeBoxCard.eulerAngles;
                scale = this.nodeBoxCard.scale;
                break;

            case CardLocation.Player3:
                eulerAngles = v3(0, 0, -90);
                scale = v3(1, 1, 1).multiplyScalar(0.4);
                break;
            case CardLocation.Banker3:
                eulerAngles = v3(0, 0, 90);
                scale = v3(1, 1, 1).multiplyScalar(0.4);
                break;

            default:
                eulerAngles = v3(0);
                scale = v3(1, 1, 1).multiplyScalar(0.4);
                break;
        }
        if (animated) {
            tween(node).to(0.5, { scale, eulerAngles }).start();
        } else {
            node.scale = scale;
            node.eulerAngles = eulerAngles;
        }
    }
}
