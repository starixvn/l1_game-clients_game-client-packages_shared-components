import { _decorator, Label, Prefab, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "./handlers/auto-play-handler";
import { AutoPlayStore } from "./stores/auto-play-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlay extends ObserverComponent {
    @property(Label)
    lblnoOfRound: Label = null;

    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @property(Prefab)
    prfautoPlayPopup: Prefab = null;

    @handle(AutoPlayHandler, (handle) => handle.checkAutoPlayClick())
    onClickAutoPlay() {}

    @render(AutoPlayStore, (store) => store.autoPlayRounds)
    setNoOfRound(rounds: number) {
        this.lblnoOfRound.string = rounds.toString();
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayButton(isAutoPlay: boolean) {
        this.lblnoOfRound.node.active = isAutoPlay;
        this.sprIconAutoPlay.node.active = !isAutoPlay;
    }
}
