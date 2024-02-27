import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class IntroPFPopup extends ObserverComponent {
    @handle(gc.GuidePF.GuidePFHandlers, (handle) => handle.resetUrl())
    resetUrl() {}
}
