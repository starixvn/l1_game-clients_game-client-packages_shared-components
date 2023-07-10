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
    highlightWinning: Node = null;

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

    public setHighlight(isHighlight: boolean, isAnimated: boolean) {
        this.handleHighlightAnim(isHighlight && isAnimated);
        this.handleHighlightBorder(isHighlight && !isAnimated);
    }

    protected handleHighlightAnim(isActive: boolean) {
        this.highlightWinning.active = isActive;
        this.highlightBackground.active = isActive;
    }

    protected handleHighlightBorder(isActive: boolean) {
        this.highlightBorder.active = isActive;
    }

    public resetHighlightBorder() {
        this.highlightBorder.active = false;
    }
}
