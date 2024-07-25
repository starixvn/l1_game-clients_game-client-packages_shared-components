import { _decorator, Button, Color, Component, Label, Node, sp, Sprite, SpriteAtlas } from "cc";
import { AnimationUtils } from "../../../shared/utils";
import { CardModel, convertRank, ServiceCard } from "./poker-card";
const { ccclass, property } = _decorator;

export interface FairnessCardData {
    card: ServiceCard;
    index: number;
}

enum AnimationName {
    OpenCard = "open-card",
    CloseCard = "close-card",
    LuckyCard = "lucky-card",
    BackCard = "default-back",
    FrontCard = "default-front",
    FrontCardGold = "default-front-gold",
    HighlightCardOn = "highlight",
    HighlightCardOff = "default",
}

@ccclass
export class FairnessSpineCard extends Component {
    @property(sp.Skeleton)
    skeletonCard: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeletonCardWin: sp.Skeleton = null;

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Sprite)
    rank: Sprite = null;

    @property(Sprite)
    smallSuit: Sprite = null;

    @property(Sprite)
    largeSuit: Sprite = null;

    @property(Label)
    lblCardIndex: Label = null;

    @property(Node)
    bgGolden: Node = null;

    @property(Button)
    btnOnCard: Button = null;

    private _clickCallback = () => {};

    protected readonly suits = ["heart", "diamond", "club", "spade"];
    protected readonly picture = {
        j: "j_picture",
        q: "q_picture",
        k: "k_picture",
    };

    public card: CardModel = { rank: "A", suit: 3 };
    public cardIndex = 0;

    protected onLoad(): void {
        this.setStatusSkeletonCardWin(false);
    }

    setStatusSkeletonCardWin(status: boolean) {
        this.skeletonCardWin?.node && (this.skeletonCardWin.node.active = status);
    }

    async setGoldenCard(animated = true) {
        await AnimationUtils.playSpine(this?.skeletonCard, animated ? AnimationName.LuckyCard : AnimationName.FrontCardGold, false);
    }

    async setWinHighlight() {
        this.setStatusSkeletonCardWin(true);
        await AnimationUtils.playSpine(this?.skeletonCardWin, AnimationName.HighlightCardOn, false);
    }

    async openCard(animated = true) {
        this.setDetailCard();
        await AnimationUtils.playSpine(this?.skeletonCard, animated ? AnimationName.OpenCard : AnimationName.FrontCard, false);
    }

    async closeCard(animated = true) {
        this.setStatusSkeletonCardWin(false);
        await AnimationUtils.playSpine(this?.skeletonCard, animated ? AnimationName.CloseCard : AnimationName.BackCard, false);
    }

    faceDown() {
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.BackCard, false);
    }

    setClickCallback(callback: () => void) {
        if (callback) {
            this._clickCallback = callback;
        }
    }

    setData(data: FairnessCardData) {
        const { card, index } = data;
        this.setCardData(card);
        this.setIndexValue(index);
    }

    setCardData(card: ServiceCard) {
        this.setCard({ rank: convertRank(+card.rank), suit: card.suit });
    }

    protected setCard(card: CardModel) {
        this.card = card;
    }

    setIndexValue(index: number) {
        const cardIndex = index + 1;
        this.lblCardIndex.string = `${cardIndex}`;
        this.cardIndex = cardIndex;
    }

    onClickCard() {
        this._clickCallback();
    }

    protected setDetailCard() {
        if (this.card) {
            const lowerCaseRank = this.card.rank.toLowerCase();
            const frame = this.atlas.getSpriteFrame(lowerCaseRank);
            this.rank.spriteFrame = frame;
            this.rank.color = this.card.suit > 1 ? Color.BLACK : new Color("#960000");
            this.smallSuit.spriteFrame = this.atlas.getSpriteFrame(`${this.suits[this.card.suit]}_small`);

            this.setLargeSuiteImage(lowerCaseRank);
        } else {
            console.warn("Call setFaceUp when this.card null");
            this.closeCard(false);
        }
    }

    protected setLargeSuiteImage(lowerCaseRank: string) {
        if (+this.card.rank || this.card.rank === "A") {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.suits[this.card.suit]);
        } else {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.picture[lowerCaseRank]);
        }
    }
}
