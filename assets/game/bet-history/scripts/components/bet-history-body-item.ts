import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { IBetLog } from "./bet-detail/stores/bet-detail-store";
export default class BetHistoryBodyItem extends ObserverComponent {
    setData(data: gc.BetHistory.IBetHistoryLog, index: number) {}
}

export class BaseResultBodyItem extends ObserverComponent {
    setData(betLog: IBetLog) {}
}
