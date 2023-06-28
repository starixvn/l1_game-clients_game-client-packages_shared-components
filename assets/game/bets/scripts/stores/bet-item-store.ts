import gc from "@sg/game-client-base";
import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

interface Chips {
    chipBox?: Node;
}

export interface IMainPlayerChip extends Chips {
    chipValue: number;
}

export interface TBetStartingRound {
    isStartingRound: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
}

@injectable()
export class BetItemStore {
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get getBetStartingRoundInfo() {
        return {
            isStartingRound: this.roundTimeStore.isStartingRound,
            settlementResult: this.settlementStore.settlementResult,
        };
    }
}
