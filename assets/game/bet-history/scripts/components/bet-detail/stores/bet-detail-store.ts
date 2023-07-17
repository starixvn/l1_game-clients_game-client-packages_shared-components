import inversify from "inversify";
import mobx from "mobx";
import { ServiceCard } from "../../../../../poker-cards/scripts/poker-card";
import { IBetHistoryLog } from "@sg/game-client-base/dist/game/bet-history";
const { injectable } = inversify;

export interface IBetLogDetails {
    amount: number;
    time: string;
    choice: string;
}

export interface IBetHistoryLogInDetails extends IBetHistoryLog {
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

export interface IBetDetailModel{
    betLog: IBetHistoryLogInDetails;
    fractionalOddsFormat: boolean;
}

@injectable()
export class BetDetailStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    model: IBetDetailModel = null;

    setData(model: IBetDetailModel) {
        this.model = model;
    }
}
