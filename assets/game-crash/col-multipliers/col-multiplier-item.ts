import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass("col_multiplier_item")
export class ColMultiplierItem extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    setMultiplier(value: number) {
        this.lblMultiplier.string = FormatUtils.numberWithCommas(value, 2);
    }
}
