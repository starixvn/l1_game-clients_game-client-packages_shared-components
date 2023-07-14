import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { PokerCard, ServiceCard } from "../../../../../poker-cards/scripts/poker-card";
import { IBetHistoryLog } from "@sg/game-client-base/dist/game/bet-history";
const { injectable, inject } = inversify;

export interface IBetLogDetails {
    amount: number;
    time: string;
    choice: string;
}

export interface IBetLog extends IBetHistoryLog {
    betwin: number;
    totalAmount: number;
    freeBet: boolean;
    odds: {
        dragon: number;
        tiger: number;
        tie: number;
        redDragon: number;
        blackDragon: number;
        redTiger: number;
        blackTiger: number;
    };
    result: {
        dragon: ServiceCard;
        tiger: ServiceCard;
    };
    settlementResult: {
        dragon: boolean;
        tiger: boolean;
        tie: boolean;
        blackDragon: boolean;
        redDragon: boolean;
        blackTiger: boolean;
        redTiger: boolean;
    };
    betLogDetails: Array<IBetLogDetails>;
}

@injectable()
export class BetDetailStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    betLog: IBetLog = null;

    setData(betLog: IBetLog) {
        this.betLog = betLog;
    }
}
