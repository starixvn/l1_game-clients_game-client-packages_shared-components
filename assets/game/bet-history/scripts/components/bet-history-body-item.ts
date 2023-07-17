import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { IBetHistoryLog } from "@sg/game-client-base/dist/game/bet-history";
export default class BetHistoryBodyItem extends ObserverComponent {
    setData(data: gc.BetHistory.IBetHistoryLog, index: number, fractionalOddsFormat: boolean) {}
}

export class BaseResultBodyItem extends ObserverComponent {
    setData(betLog: IBetHistoryLog) {}
}
