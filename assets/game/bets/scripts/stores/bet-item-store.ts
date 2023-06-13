import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

interface Chips {
    chipBox?: Node;
}

export interface IMainPlayerChip extends Chips {
    chipAmount: number;
}

export interface TBetStartingRound {
    isStartingRound: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
}

@injectable()
export class BetItemStore {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;
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
