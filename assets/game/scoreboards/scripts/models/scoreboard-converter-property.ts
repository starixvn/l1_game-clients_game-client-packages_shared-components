import { _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ScoreboardConverterProperty")
export class ScoreboardConverterProperty {
    @property
    key: string = "";

    @property
    value: string = "";
}
