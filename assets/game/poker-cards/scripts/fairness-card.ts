import gc from "@sg/game-client-base";
import { _decorator, Button, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { PokerCard, ServiceCard } from "./poker-card";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { GameBaccaratX } = gc;

export interface FairnessCardData {
    card: ServiceCard;
    index: number;
}

@ccclass
export class FairnessCard extends ObserverComponent {
    @property(Node)
    nodeCard: Node = null;

    @property(Label)
    lblCardIndex: Label = null;

    @property(Button)
    btnOnCard: Button = null;

    private _card: PokerCard = null;
    private _clickCallback = () => {};

    get card(): PokerCard {
        if (this._card === null) {
            this._card = this.nodeCard.getComponent(PokerCard);
        }
        return this._card;
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

    setIndexValue(index: number) {
        this.lblCardIndex.string = `${index}`;
    }

    onClickCard() {
        this._clickCallback();
    }

    // @render(GameBaccaratX.Shoe.CardIndexStore, (store) => store.cardIndex)
    // renderCardIndex(cardIndex: GameServiceMessage.BaccaratX) {
    //     this.lblCardIndex.string = cardIndex.currentIndex.toString();
    // }
}
