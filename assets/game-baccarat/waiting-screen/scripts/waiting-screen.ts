import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;
const { CutCardPF } = gc;

@ccclass
export class WaitingScreen extends ObserverComponent {
    @property(Node)
    nodeDisabled: Node = null;

    @handle(CutCardPF.FairnessHandler, (handler, isShow: boolean) => handler.handleShowFairnessSettingsPopup(isShow))
    onClickCutCardBtn() {
        return true;
    }

    @render(CutCardPF.CutCardStore, (store) => store.cutCardInfo)
    showCutCardButtonSection(cutCardInfo: any) {
        this.nodeDisabled.active = cutCardInfo && cutCardInfo.successful;
    }
}
