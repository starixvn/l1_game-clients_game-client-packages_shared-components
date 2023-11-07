import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

export type BetLogDetail = {
    action: string;
    amount: number;
    winAmount: number;
    multiplier: number;
} & gc.BetHistory.BetDetailsLog;

@ccclass
export default class BetDetailBodyItem {
    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblResult: Label = null;

    @property(Label)
    lblAction: Label = null;

    setData() {}
}
