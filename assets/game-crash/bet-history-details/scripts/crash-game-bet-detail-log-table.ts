import gc from "@sg/game-client-base";
import { _decorator, Prefab } from "cc";

import { BetDetailLogTable } from "../../../game/bet-history/scripts/components/bet-detail/bet-detail-log-table";

const { ccclass, property } = _decorator;
interface IBetDetailLog {
    amount: number;
    winAmount: number;
    multiplier: number | null;
    time: string | null;
    action: string;
}

@ccclass
export class CrashGameBetDetailLogTable extends BetDetailLogTable {
    showBetDetail(bodyItemPrefab: Prefab, model: gc.BetHistory.BetDetailModel) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;

        betLogDetails.forEach((betDetailsLog, index) => {
            let log = betDetailsLog as IBetDetailLog & gc.BetHistory.DynamicObject<object>;
            this.handleUserHalfCashOutAndGameCrash(model, log, bodyItemPrefab); // when user just cashout 50% and game crash
            const caclIndex = betLogDetails.length > 1 && log.action === "halfCashOut" ? index : 1;
            this.body.addChild(
                this.buildBodyRow(bodyItemPrefab, {
                    betDetailsLog,
                    index: caclIndex,
                    odds,
                    settlementResult,
                    result,
                    freeBet,
                    fractionalOddsFormat,
                })
            );
        });
    }

    handleUserHalfCashOutAndGameCrash(model: gc.BetHistory.BetDetailModel, log, bodyItemPrefab) {
        const { fractionalOddsFormat, betHistoryLog } = model;
        const { result, settlementResult, odds, freeBet, betLogDetails } = betHistoryLog;
        if (betLogDetails.length === 1 && log.action === "halfCashOut") {
            const crashLog: IBetDetailLog = {
                amount: log.amount,
                winAmount: 0,
                multiplier: null,
                time: null,
                action: null,
            };
            this.body.addChild(
                this.buildBodyRow(bodyItemPrefab, {
                    betDetailsLog: crashLog as IBetDetailLog & gc.BetHistory.DynamicObject<object>,
                    index: 0,
                    odds,
                    settlementResult,
                    result,
                    freeBet,
                    fractionalOddsFormat,
                })
            );
        }
    }
}
