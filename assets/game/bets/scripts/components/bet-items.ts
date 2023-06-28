import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
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
        console.log(this.betItemComponents);
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
