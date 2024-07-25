import { _decorator, Button, Component, Label, Node } from "cc";
import { ServiceCard } from "./poker-card";
import { PokerCardSpine } from "./poker-card-spine";
const { ccclass, property } = _decorator;

export interface FairnessCardData {
    card: ServiceCard;
    index: number;
}

@ccclass
export class FairnessCard extends Component {
    @property(Node)
    nodeCard: Node = null;

    @property(Label)
    lblCardIndex: Label = null;

    @property(Button)
    btnOnCard: Button = null;

    private _card: PokerCardSpine = null;
    private _clickCallback = () => {};

    get card(): PokerCardSpine {
        if (this._card === null) {
            this._card = this.nodeCard.getComponent(PokerCardSpine);
        }
        return this._card;
    }

    setGoldenCard(show: boolean, animated: boolean) {
        this.card.setGoldenCard(show, animated);
    }

    setWinHighlight(show: boolean) {
        this.card.setWinHighlight(show);
    }
    setClickCallback(callback: () => void) {
        if (callback) {
            this._clickCallback = callback;
        }
    }

    setData(data: FairnessCardData) {
        const { card, index } = data;
        this.card.setServiceCard(card);
        this.setIndexValue(index);
    }

    setCardData(card: ServiceCard) {
        this.card.setServiceCard(card);
    }

    openCard(animated = true) {
        return this.card.openCard(animated);
    }

    closeCard(duration = 0) {
        if (duration === 0) {
            this.card.faceDown();
            return;
        }
        return this.card.closeCard(duration);
    }

    setIndexValue(index: number) {
        this.lblCardIndex.string = `${index + 1}`;
    }

    onClickCard() {
        this._clickCallback();
    }
}
