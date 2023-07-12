import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LedLightTooltip")
export abstract class LedLightTooltip extends Component {
    @property(Label)
    result: Label = null;

    @property(Label)
    roundId: Label = null;

    public abstract setTooltipInfo(data: any): void;

    public showTooltip(show = true) {
        this.node.active = show;
    }
}
