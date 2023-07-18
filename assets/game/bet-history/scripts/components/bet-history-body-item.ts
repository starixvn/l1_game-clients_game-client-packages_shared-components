import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

export default class BetHistoryBodyItem extends ObserverComponent {
    setData(data: gc.BetHistory.BetHistoryLog, index: number) {}
}

export class BaseResultBodyItem extends ObserverComponent {
    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {}
}
