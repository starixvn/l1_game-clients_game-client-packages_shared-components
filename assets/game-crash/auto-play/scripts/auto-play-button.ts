import { Label, Node, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "./handlers/auto-play-handler";
import { AutoPlayStore } from "./stores/auto-play-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlayButton extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @property(Node)
    nodeTextAutoPlay: Node = null;

    @property(Node)
    nodeTextStopAutoPlay: Node = null;

    @handle(AutoPlayHandler, (handle) => handle.checkAutoPlayClick())
    onClickAutoPlay() {}

    @render(AutoPlayStore, (store) => store.roundsAutoPlay)
    setNoOfRound(roundsAutoPlay: number) {
        this.lblNoOfRound.string = roundsAutoPlay.toString();
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayButton(isAutoPlay: boolean) {
        this.lblNoOfRound.node.active = this.nodeTextStopAutoPlay.active = isAutoPlay;
        this.sprIconAutoPlay.node.active = this.nodeTextAutoPlay.active = !isAutoPlay;
    }
}
