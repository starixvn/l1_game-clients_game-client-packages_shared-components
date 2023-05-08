import { _decorator, Component, Label } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass()
export class SingleTimer extends Component {
    @property({ type: Label })
    lblSingle: Label = null;

    @render(RoundTimeStore, (store) => store.countdownTimer)
    setTime(time: number) {
        this.lblSingle.string = time.toString().padStart(2, "0");
    }
}
