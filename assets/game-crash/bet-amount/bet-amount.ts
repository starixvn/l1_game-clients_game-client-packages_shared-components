import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { PlayerActionStore } from "../player-actions/player-action-store";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { Bet } = gc;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    withBetAccepted(isReceivedBet: boolean) {
        this.showHideDisabledNode(isReceivedBet);
    }

    @render(PlayerActionStore, (store) => store.visibleBetAmount)
    showPlaceBetNextRound(visibleBetAmount: boolean) {
        this.showHideDisabledNode(visibleBetAmount);
    }
}
