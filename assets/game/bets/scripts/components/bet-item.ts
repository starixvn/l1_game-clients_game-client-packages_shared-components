import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { render, handle } = Observer;

const { Rounds, RoundHistories } = gc;

const { property, ccclass } = _decorator;

@ccclass
export default class BetItem extends ObserverComponent {
    @property(Label)
    lblOwnBet: Label = null;

    @property(Label)
    lblTotalBet: Label = null;

    @property(Label)
    lblOdds: Label = null;

    @property(Node)
    chipBox: Node = null;

    @property(Node)
    highlightBorder: Node = null;

    @property(Node)
    highlightBackground: Node = null;

    @property(Node)
    highlight: Node = null;

    onLoad() {
        super.onLoad();
        this.lblOwnBet.string = "";
        this.lblTotalBet.string = "";
        this.lblOdds.string = "";
    }

    get betChoice() {
        return this.node.name;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @handle(gc.Bet.BetHandler, (handler, payload: string) => handler.handle(payload))
    onBet() {
        this.playSoundClick();
        return this.node.name;
    }

    renderOdd(odds, fractional) {
        this.lblOdds.string = gc.FormatUtils.formatOdds(odds, fractional);
    }

    renderOwnBet(ownBet: string) {
        this.lblOwnBet.string = ownBet;
    }

    renderTotalBet(totalBet: string) {
        this.lblTotalBet.string = totalBet;
    }

    clearChips() {
        this.chipBox?.destroyAllChildren();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.highLightInfo)
    handleJoinGame(highLightInfo: gc.RoundHistories.THighLightInfo) {
        const { roundHistory, isHighLightAnim, isResetHighlight } = highLightInfo;
        this.highlightWonBet(roundHistory?.settlementResult, isHighLightAnim);
        if (isResetHighlight) {
            this.highlightBorder.active = false;
        }
    }

    protected setHighlight(highlight: boolean, isAnimated: boolean) {
        this.highlight.active = highlight && isAnimated;
        this.handleHighlightBackground(highlight, isAnimated);
        this.handleHighlightBorder(highlight, isAnimated);
    }

    protected handleHighlightBackground(highlight: boolean, isAnimated = true) {
        this.highlightBackground && (this.highlightBackground.active = highlight && isAnimated);
    }

    protected handleHighlightBorder(highlight: boolean, isAnimated: boolean) {
        this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
    }

    highlightWonBet(settlementResult: gc.GameServiceMessage.TSettlementResult, isAnimated: boolean) {
        const choice = this.node?.name ?? "";
        this.setHighlight(settlementResult?.[choice], isAnimated);
    }
}
