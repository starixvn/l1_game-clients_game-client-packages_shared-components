import { _decorator, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionStore } from "../player-actions/player-action-store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(PlayerActionStore, (store) => store.visibleBetAmount)
    adjustBetAmount(visibleBetAmount: boolean) {
        this.showHideDisabledNode(visibleBetAmount);
    }
}
