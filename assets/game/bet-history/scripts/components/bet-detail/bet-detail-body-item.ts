import { ObserverComponent } from "../../../../../shared/common-components/observer-component/scripts/observer-component";
import { IBetLogDetails } from "./stores/bet-detail-store";

export default class BetDetailBodyItem extends ObserverComponent {
    setData(betLogDetail: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean, fractionalOddsFormat: boolean) {}
}
