import { _decorator, CCString, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HistoryResultItemModel")
export class HistoryResultItemModel {
    @property(CCString)
    choiceNames = "";

    @property(SpriteFrame)
    backgroundForChoice: SpriteFrame = null;
}
