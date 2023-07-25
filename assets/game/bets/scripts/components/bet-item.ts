import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { handle } = Observer;
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
    highlightStatic: Node = null;

    @property(Node)
    highlightAnim: Node = null;

    @property(Node)
    choice: Node = null;

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

    renderOdd(odds: number, fractional: boolean) {
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

    public handleHighlightAnim(isActive: boolean) {
        this.highlightAnim.active = isActive;
    }

    public handleHighlightStatic(isActive: boolean) {
        this.highlightStatic.active = isActive;
    }
}
