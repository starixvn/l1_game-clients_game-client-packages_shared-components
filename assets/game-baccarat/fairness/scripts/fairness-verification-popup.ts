import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ServiceCard, convertRank } from "../../../game/poker-cards/scripts/poker-card";
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

    renderCards(cards: ServiceCard[], usedCardIndexes: number[]) {
        cards.forEach((card, index) => {
            let cardNode = instantiate(this.prfCard);
            const comp = cardNode.getComponent(FairnessPokerCard);
            comp.card = { rank: convertRank(card.rank), suit: card.suit };
            comp.faceUp();
            comp.showHighlight(usedCardIndexes.includes(index));
            this.nodeCardsContent.addChild(cardNode);
        });
    }

    @handle(CutCardPF.FairnessHandler, (handle, roundId: number) => handle.openCutCardIndex(roundId))
    onClickDetail() {
        return this.roundId;
    }
}
