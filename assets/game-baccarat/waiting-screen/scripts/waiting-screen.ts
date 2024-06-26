import gc from "@sg/game-client-base";
import { _decorator, Layout, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;
const { CutCardPF } = gc;

@ccclass
export class WaitingScreen extends ObserverComponent {
    @property(Node)
    nodeCutCardButtonSection: Node = null;

    @property(Layout)
    nodeWrapper: Layout = null;

    @handle(CutCardPF.FairnessHandler, (handler, isShow: boolean) => handler.handleShowFairnessSettingsPopup(isShow))
    onClickCutCardBtn() {
        return true;
    }

    // @render(CutCardPF.FairnessStore, (store) => store.isShowFairnessSettingsPopup)
    // showCutCardButtonSection(isShow: boolean) {
    //     !isShow && (this.nodeCutCardButtonSection.active = true);
    //     this.nodeWrapper.enabled = true;
    //     this.nodeWrapper.updateLayout();
    //     this.nodeWrapper.enabled = false;
    // }
}
