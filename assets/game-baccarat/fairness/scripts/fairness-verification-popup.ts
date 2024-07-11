import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, instantiate, Label, Node, Prefab, ScrollView } from "cc";
import Observer from "observer";
import { Dialog } from "../../../shared/common-components/dialogs/dialog";
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

    @property(Prefab)
    prfCutCard: Prefab = null;

    @property(ScrollView)
    cardsScrollView: ScrollView = null;

    roundId = 0;
    private pfData: GameServiceMessage.ShoeVerification = null;

    start() {
        this.handleRoundId();
        this.node?.getComponent(Dialog) &&
            (this.node.getComponent(Dialog).callBackFn = () => {
                this.renderCards(this?.pfData);
            });
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
        this.pfData = pf;
    }

    handleRoundId() {
        this.lblRoundId.string = this.roundId.toString();
    }

    renderCards(pf: GameServiceMessage.ShoeVerification) {
        const { cards, usedCardIndexes, cutCardIndex } = pf;
        cards?.forEach((card, index) => {
            let cardNode = instantiate(this.prfCard);
            const comp = cardNode.getComponent(FairnessPokerCard);
            comp.cardFairness.setCardData(card);
            comp.cardFairness.card.faceUp();
            comp.cardFairness.setIndexValue(index);
            if (cutCardIndex === index) {
                const cutCard = instantiate(this.prfCutCard);
                this.nodeCardsContent.addChild(cutCard);
            }
            comp.showHighlight(usedCardIndexes.includes(index));
            this.nodeCardsContent.addChild(cardNode);
        });
        this.cardsScrollView?.scrollToTop(0);
    }

    @handle(CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openCutCardIndex(roundId))
    onClickDetail() {
        return this.roundId;
    }
}
