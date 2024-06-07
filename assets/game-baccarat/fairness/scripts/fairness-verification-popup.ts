import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { CardModel, convertRank } from "../../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FairnessPokerCard } from "./fairness-poker-card";
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX } = gc;
const { render, handle } = Observer;

@ccclass
export class FairnessVerificationPopup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblShoeResultSHA256: Label = null;

    @property(Label)
    lblShoeResult: Label = null;

    @property(Label)
    lblMergeSeed: Label = null;

    @property(Node)
    nodeCardsContent: Node = null;

    @property(Prefab)
    prfCard: Prefab = null;

    roundId = 0;

    start() {
        this.handleRoundId();
    }

    @handle(CutCardPF.FairnessHandler, (handle) => handle.closeVerification())
    closePoup() {}

    @render(GameBaccaratX.RoundPF.RoundPFStore, (store) => store.pf, { fireImmediately: false })
    renderPFRound(pf: GameServiceMessage.ShoeVerification) {
        if (!pf) {
            return;
        }

        this.lblShoeResult.string = pf.rawValue;
        this.lblShoeResultSHA256.string = pf.hashValue;
        this.lblMergeSeed.string = pf.cutCardIndex.toString();
        this.renderCards(pf.cards, pf.usedCardIndexes);
    }

    handleRoundId() {
        this.lblRoundId.string = this.roundId.toString();
    }

    convertCardsToModel(cards: string[]) {
        let cardsModel: CardModel[] = [];

        cards.forEach((card, index) => {
            const length = card.length - 1;
            cardsModel.push({
                rank: convertRank(+card.slice(0, length)),
                suit: +card.charAt(length),
            });
        });
        return cardsModel;
    }

    renderCards(cards: string[], usedCardIndexes: number[]) {
        let cardsModel = this.convertCardsToModel(cards);
        cardsModel.forEach((card, index) => {
            let cardNode = instantiate(this.prfCard);
            const comp = cardNode.getComponent(FairnessPokerCard);
            comp.card = card;
            comp.faceUp();
            comp.showHighlight(usedCardIndexes.includes(index));
            this.nodeCardsContent.addChild(cardNode);
        });
    }
}
