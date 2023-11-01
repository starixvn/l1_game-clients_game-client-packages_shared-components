import { _decorator, Label, RichText } from "cc";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

@ccclass
export class Md5Popup extends ObserverComponent {
    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblRoundId: Label = null;

    @property(RichText)
    lblMd5Key: RichText = null;

    @property(RichText)
    lblResult: RichText = null;
}
