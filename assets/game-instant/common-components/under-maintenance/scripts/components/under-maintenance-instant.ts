import { _decorator, Label } from "cc";
import { ObserverComponent } from "../../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

@ccclass("UnderMaintenanceInstant")
export class UnderMaintenanceInstant extends ObserverComponent {
    @property(Label)
    lblMessage: Label = null;
}
