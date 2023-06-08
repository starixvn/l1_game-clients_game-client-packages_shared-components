import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { ObserverComponent } from "./../../../common/observer-component/scripts/observer-component";
import BetItem from "./bet-item";
const { ccclass } = _decorator;

const { render } = Observer;
const { Settlements } = gc;

@ccclass()
export class BetItems extends ObserverComponent {
    betItemComponents: BetItem[] = [];
    settlementResult: gc.GameServiceMessage.TSettlementResult = null;

    onLoad() {
        super.onLoad();
        this.betItemComponents = this.node.getComponentsInChildren(BetItem) ?? [];
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult)
    updateSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        settlementResult && (this.settlementResult = settlementResult);
    }

    get lostBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => !this.settlementResult?.[item.betChoice]);
    }

    get winBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => this.settlementResult?.[item.betChoice]);
    }
}
