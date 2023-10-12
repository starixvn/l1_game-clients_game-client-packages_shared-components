import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class CashOutButton extends ObserverComponent {
    @property(Label)
    lblValue: Label = null;

    @property(Node)
    nodeDisabled: Node = null;
}
