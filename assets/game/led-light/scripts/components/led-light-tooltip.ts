import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LedLightTooltip")
export class LedLightTooltip extends Component {
    @property(Label)
    result: Label = null;

    @property(Label)
    roundId: Label = null;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        // handle
    }

    public showTooltip(show = true) {
        this.node.active = show;
    }
}
