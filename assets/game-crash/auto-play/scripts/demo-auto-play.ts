import { _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "./handlers/auto-play-handler";
import { AutoPlayStore } from "./stores/auto-play-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class DemoAutoPlay extends ObserverComponent {
    private interval;
    onLoad() {
        super.onLoad();
    }
    @handle(AutoPlayHandler, (handle) => handle.decreaseAutoPlayRounds())
    checkNoOfRound() {}

    runAutoPlay() {
        this.interval = setInterval(() => this.checkNoOfRound(), 1000);
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    startAutoPlay(isAutoPlay: boolean) {
        isAutoPlay && this.runAutoPlay();
    }
}
