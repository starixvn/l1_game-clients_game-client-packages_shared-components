import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

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

    @handle(gc.GameCrash.AutoPlay.AutoPlayHandler, (handle) => handle.checkAutoPlayClick())
    onClickAutoPlay() {
        this.playSoundClick();
    }

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.roundsAutoPlay)
    setNoOfRound(roundsAutoPlay: number) {
        this.lblNoOfRound.string = roundsAutoPlay.toString();
    }

    @render(gc.GameCrash.AutoPlay.AutoPlayStore, (store) => store.showHideArrowIcon)
    updateAutoPlayButton(showHideArrowIcon: boolean) {
        this.lblNoOfRound.node.active = this.nodeTextStopAutoPlay.active = showHideArrowIcon;
        this.sprIconAutoPlay.node.active = this.nodeTextAutoPlay.active = !showHideArrowIcon;
        this.enableAutoPlay(showHideArrowIcon);
    }

    @handle(gc.GameCrash.PlayerActions.PlayerActionHandlers, (handle, flag: boolean) => handle.handleEnableAutoPlayInStore(flag))
    enableAutoPlay(isAutoPlay: boolean) {
        return isAutoPlay;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
