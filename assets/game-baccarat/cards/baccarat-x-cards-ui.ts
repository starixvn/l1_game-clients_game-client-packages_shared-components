import gc from "@sg/game-client-base";
import { Label, Node, Prefab, UITransform, Vec3, _decorator, instantiate, sp, tween, v3 } from "cc";
import Observer from "observer";
import { FairnessCard } from "../../game/poker-cards/scripts/fairness-card";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { bundleManager } from "../../shared/common-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../shared/utils";
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
    nodeBgNewShoe: Node = null;

    @property(Node)
    nodeBurnCards: Node = null;

    @property(Node)
    nodeCutCards: Node = null;

    @property
    spineCutCardPath = "";

    @property
    cutCardsTimePoint = 47;

    @property
    burnCardsTimePoint = 44;

    private _cardHands: BaccaratXCards[] = [];
    private readonly movingCardDuration = 0.5;

    currentCardIndex = -1;

    cards: FairnessCard[] = [];

    cardPool: PoolItem[] = [];

    spineCutCard: sp.Skeleton = null;

    private cardsStates: gc.GameBaccaratX.CardsState = {};
    private burnCardsNodes: Node[] = [];
    private durations: gc.GameConfigs.DurationSetting;

    async onLoad() {
        this.nodeBgNewShoe.active = false;
        await this.initCards();
        super.onLoad();
    }

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.durations)
    storeSettingDurations(durations: gc.GameConfigs.DurationSetting) {
        this.durations = durations;
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
            this.nodeCutCards.addChild(node);
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
        node.setScale(v3(0.34, 0.34));
        return node;
    }

    get cardHands() {
        if (this._cardHands.length === 0) {
            this._cardHands = this.getComponentsInChildren(BaccaratXCards);
        }
        return this._cardHands;
    }

    hasWaitingCards(): boolean {
        return !!this.cardPool.find((card) => card.location === CardLocation.Waiting1 || card.location === CardLocation.Waiting2);
    }

    getItemAtLocation(location: number): PoolItem {
        return this.cardPool.find((card) => card.location === location);
    }

    updateLocation(item: PoolItem, location: number) {
        item.location = location;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    async closeCards(isStartRound) {
        this.cardHands.forEach((comp) => {
            comp.showScore(false);
        });
        if (isStartRound) {
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
                this.currentCardIndex += others.length;
                await this.drawingCards(pool, true);
            } else {
                const onTableCards = this.cardPool.filter(
                    (card) => card.location !== CardLocation.Box && card.location !== CardLocation.Trash
                );
                if (onTableCards.length > 0) {
                    this.currentCardIndex += this.cardPool.length;
                }
                await this.draw6Cards(true);
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
        await Promise.all(
            cards.map(async (item) => {
                item.card.closeCard(animated ? this.movingCardDuration / 2 : 0);
                await this.moveCard(item.card.node, CardLocation.Trash, animated);
                item.card.node.active = false;
                this.updateLocation(item, CardLocation.Trash);
            })
        );
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
        card.setSiblingIndex(99);
        const nextPosition = this.nodeCardContainer.getComponent(UITransform).convertToNodeSpaceAR(this.getPosition(nextLocation));
        this.transformCardNode(card, nextLocation, animated);
        await this.moveCardAnimation(card, nextPosition, animated);
        card.setSiblingIndex(0);
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
            console.log(`received current index ======================== `, this.currentCardIndex);
        }
    }

    decreaseCardIndexForOldRound(result) {
        let count = 0;
        [GameBaccaratX.BetChoice.Player, GameBaccaratX.BetChoice.Banker].forEach((hand) => {
            ["card1", "card2", "card3"].forEach((cardKey) => {
                if (result[hand][cardKey]) {
                    count++;
                }
            });
        });
        this.currentCardIndex = this.currentCardIndex - count;
        console.log(`decrease card index ======================== ${count} => ${this.currentCardIndex}`);
    }

    @handle(GameBaccaratX.Multiplier.BaccaratMultipliersHandler, (handler, cardsStates: gc.GameBaccaratX.CardsState) =>
        handler.openCards(cardsStates)
    )
    updateCardStates(card: ServiceCard, index: number) {
        const hand = index % 2 === 0 ? gc.GameBaccaratX.BetChoice.Player : gc.GameBaccaratX.BetChoice.Banker;
        this.cardsStates[hand] = this.cardsStates[hand] ?? [];
        this.cardsStates[hand].push(card);
        return this.cardsStates;
    }

    clearCardStates() {
        this.cardsStates = {};
    }

    async openCards(result: BaccaratResult, settlemenResult: gc.GameServiceMessage.TSettlementResult, animated = true) {
        const dataCards: ServiceCard[] = [];
        for (let i = 0; i < 3; i++) {
            [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team) => {
                const handData = result[team];
                dataCards.push(handData[`card${i + 1}`]);
            });
        }

        let index = 0;
        this.clearCardStates();
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
                this.updateCardStates(data, dataIndex);

                this.node.emit(CardEvent.OPENED_CARD, { card, data, animated });
                index++;
            }
        }
        this.updateFinalPayout(settlemenResult);
        [gc.GameBaccaratX.BetChoice.Player, gc.GameBaccaratX.BetChoice.Banker].forEach((team, index) => {
            const handData = result[team];
            const comp = this.cardHands[index];
            comp.setScore(handData.score);
        });
    }

    @handle(GameBaccaratX.Multiplier.BaccaratMultipliersHandler, (handler, settlementResult: gc.GameServiceMessage.TSettlementResult) =>
        handler.updateFinalPayout(settlementResult)
    )
    updateFinalPayout(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return settlementResult;
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoePhase, { fireImmediately: false })
    receivedNewShoe(newShoePhase: boolean) {
        if (newShoePhase) {
            this.dropCards(this.cardPool, false);
            this.cardHands.forEach((comp) => {
                comp.showScore(false);
            });
        }
    }

    test() {
        const shoe = {
            roundTime: 48,
            cutCardIndex: 200,
            burnedCards: 7,
            firstCard: {
                rank: 5,
                suit: 3,
            },
            currentIndex: 6,
            animated: true,
        };

        this.startNewShoe(shoe);
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    async startNewShoe(shoeInfo: gc.GameServiceMessage.ShoeInfo) {
        if (!shoeInfo || !shoeInfo.animated) {
            return;
        }
        const { firstCard, burnedCards, roundTime, cutCardIndex } = shoeInfo;

        console.log("start new shoe ", roundTime);
        this.nodeBgNewShoe.active = true;
        if (roundTime >= this.cutCardsTimePoint) {
            await this.playAnimationCutCard(cutCardIndex);
        }

        if (roundTime > this.beforeStartRound) {
            await this.playAnimationBurnCards(firstCard, burnedCards, roundTime >= this.burnCardsTimePoint);
        }
    }

    async playAnimationCutCard(cutCardIndex: number) {
        await this.initSpineCutCard();
        const label = this.nodeCutCards.getComponentInChildren(Label);
        if (label) {
            label.string = gc.Translator.gameTranslate("show_cut_card_index", {
                cut_card_index: cutCardIndex,
            });
        }
        this.nodeCutCards.active = true;
        await AnimationUtils.playSpine(this.spineCutCard, "cut-card", false);
        await AnimationUtils.delayTime(0.5);
        this.nodeCutCards.active = false;
    }

    async playAnimationBurnCards(firstCard: ServiceCard, burnedCards: number, animated: boolean) {
        console.time("show burn card");
        for (let i = 0; i < burnedCards; i++) {
            const node = this.creatNewCardNode();
            const cardComp = node.getComponent(FairnessCard);
            cardComp.setIndexValue(i);
            this.nodeBurnCards.addChild(node);
            node.position = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeBoxCard);
            this.transformCardNode(node, CardLocation.Box, false);
            node.active = false;

            if (i === 0) {
                cardComp.setCardData(firstCard);
            }

            this.burnCardsNodes.push(node);
        }

        const firstCardNode = this.burnCardsNodes[0];
        firstCardNode.active = true;
        const firstCardComp = firstCardNode.getComponent(FairnessCard);
        firstCardComp.openCard(animated);
        this.transformCardNode(firstCardNode, CardLocation.Center, animated);
        await this.moveCardAnimation(firstCardNode, v3(0, 0, 0), animated);

        animated && (await AnimationUtils.delayTime(2));

        const spacingFirstCard = 25;
        const spacingBurnedCards = 10;
        const cardWidth = 60;

        const totalWidth = cardWidth * burnedCards + (burnedCards - 2) * spacingBurnedCards + spacingFirstCard;
        const firstCardsX = -totalWidth / 2 + cardWidth / 2;

        await this.moveCardAnimation(firstCardNode, v3(firstCardsX, 0, 0), animated);

        const startX = firstCardsX + spacingFirstCard + cardWidth;
        for (let i = 1; i < this.burnCardsNodes.length; i++) {
            const node = this.burnCardsNodes[i];
            node.active = true;

            this.transformCardNode(node, CardLocation.Center, animated);
            this.moveCardAnimation(node, v3(startX + (i - 1) * (cardWidth + spacingBurnedCards), 0, 0), animated);
        }
        console.timeEnd("show burn card");
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderClearBurnCards(roundTime: number) {
        if (roundTime === this.beforeStartRound) {
            this.clearBurnCards();
        }
    }

    private get beforeStartRound() {
        return this.durations.placingBet + this.durations.startRound + 1;
    }

    async clearBurnCards() {
        console.time("clear burn card");
        const dropPosition = ComponentUtils.convertPosition(this.nodeBurnCards, this.nodeTrash);
        for (let i = 0; i < this.burnCardsNodes.length; i++) {
            i > 0 && (await AnimationUtils.delayTime(0.1));
            const node = this.burnCardsNodes[i];
            this.transformCardNode(node, CardLocation.Trash);
            this.moveCardAnimation(node, dropPosition, true).then(() => {
                node.destroy();
            });
        }
        console.timeEnd("clear burn card");
        this.burnCardsNodes = [];

        this.nodeBgNewShoe.active = false;
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
                scale = v3(1, 1, 1).multiplyScalar(0.34);
                break;
            case CardLocation.Banker3:
                eulerAngles = v3(0, 0, 90);
                scale = v3(1, 1, 1).multiplyScalar(0.34);
                break;

            default:
                eulerAngles = v3(0);
                scale = v3(1, 1, 1).multiplyScalar(0.34);
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
