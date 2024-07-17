import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, CCInteger, instantiate, Label, Node, Prefab, ScrollView, UITransform, Vec2 } from "cc";
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

    @property(Dialog)
    dialog: Dialog = null;

    @property(CCInteger)
    maxIndexCard = 416;

    @property(CCInteger)
    maxCardRow = 20;

    roundId = 0;
    private pfData: GameServiceMessage.ShoeVerification = null;

    onLoad() {
        super.onLoad();

        this.dialog &&
            (this.dialog.callBackFn = () => {
                if (!this.pfData?.cards) {
                    this.scheduleOnce(this.dialog.callBackFn, 0.4);
                    return;
                }
                this.renderCards(this?.pfData);
            });
    }

    protected start(): void {
        this.handleRoundId();
    }

    onDestroy(): void {
        super.onDestroy();
        this.unscheduleAllCallbacks();
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
        const { cards, usedCardIndexes, cutCardIndex, burnedCards } = pf;

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
            comp.showBgBurnCard(index < burnedCards);
            this.nodeCardsContent.addChild(cardNode);
        });

        this.scheduleOnce(() => {
            this.handleScrollCardUsing(usedCardIndexes[0]);
        }, 0.3);
    }

    @handle(CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openCutCardIndex(roundId))
    onClickDetail() {
        return this.roundId;
    }

    handleScrollCardUsing(index: number) {
        const maxRow = Math.ceil(this.maxIndexCard / this.maxCardRow);
        const getRowIndex = Math.ceil(index / this.maxCardRow);
        const maxOffset = this.cardsScrollView?.getMaxScrollOffset()?.y || 0;
        const maskHeight = this.nodeCardsContent?.parent?.getComponent(UITransform)?.height;
        const heightOneRow = maxOffset / maxRow;
        const positionScroll = new Vec2(0, heightOneRow * getRowIndex - maskHeight / 2);
        this.cardsScrollView.scrollToOffset(positionScroll, 0.1);
    }
}
