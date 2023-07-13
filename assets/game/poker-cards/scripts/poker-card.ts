import { Color, Component, Node, Sprite, SpriteAtlas, _decorator } from "cc";
const { ccclass, property } = _decorator;

export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
    };
    return dict[num] || num.toString();
};

export interface CardModel {
    rank: string;
    suit: number;
}

export interface ServiceCard {
    rank: number;
    suit: number;
}

@ccclass
export class PokerCard extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Node)
    bgWhiteCard: Node = null;

    @property(Sprite)
    rank: Sprite = null;

    @property(Sprite)
    smallSuit: Sprite = null;

    @property(Sprite)
    largeSuit: Sprite = null;

    public card: CardModel = { rank: "A", suit: 3 };

    protected readonly suits = ["heart", "diamond", "club", "spade"];
    protected readonly picture = {
        j: "j_picture",
        q: "q_picture",
        k: "k_picture",
    };
    setServiceCard(card: ServiceCard): void {
        this.setCard({ rank: convertRank(+card.rank), suit: card.suit });
    }

    setCard(card: CardModel) {
        this.card = card;
    }

    faceUp() {
        this.changeCardFace(true);
    }

    faceDown() {
        this.changeCardFace(false);
    }

    protected changeCardFace(faceUp: boolean) {
        if (faceUp) {
            if (this.card) {
                const lowerCaseRank = this.card.rank.toLowerCase();
                const frame = this.atlas.getSpriteFrame(lowerCaseRank);
                this.rank.spriteFrame = frame;
                this.rank.color = this.card.suit > 1 ? Color.BLACK : new Color("#960000");
                this.smallSuit.spriteFrame = this.atlas.getSpriteFrame(`${this.suits[this.card.suit]}_small`);

                this.setLargeSuiteImage(lowerCaseRank);

                this.bgWhiteCard.active = true;
                this.setDetailVisibility(true);
            } else {
                console.warn("Call setFaceUp when this.card null");
                this.showCardBack();
            }
        } else {
            this.showCardBack();
        }
    }

    protected setLargeSuiteImage(lowerCaseRank: string) {
        if (+this.card.rank || this.card.rank === "A") {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.suits[this.card.suit]);
        } else {
            this.largeSuit.spriteFrame = this.atlas.getSpriteFrame(this.picture[lowerCaseRank]);
        }
    }

    protected setDetailVisibility(active: boolean) {
        this.largeSuit.node.parent.active = active;
    }

    protected showCardBack() {
        this.setDetailVisibility(false);
        this.bgWhiteCard.active = false;
    }
}
