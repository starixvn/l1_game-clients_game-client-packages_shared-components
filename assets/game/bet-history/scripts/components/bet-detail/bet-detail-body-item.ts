import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../../shared/common-components/observer-component/scripts/observer-component";

export default class BetDetailBodyItem extends ObserverComponent {
    setData(
        betDetailsLog: gc.BetHistory.BetDetailsLog,
        index: number,
        odd: number,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {}
}
