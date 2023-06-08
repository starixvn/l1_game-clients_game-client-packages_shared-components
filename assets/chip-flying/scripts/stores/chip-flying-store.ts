import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export type TPayChipInfo = {
    settleStatus: gc.Settlements.SettlementStatusStore;
    finish: {
        settlementResult: gc.GameServiceMessage.TSettlementResult;
        winningPlayers: gc.GameServiceMessage.TWinningPlayers;
    };
};

@injectable()
export class ChipFlyingStore {
    @inject(gc.Settlements.SettlementStatusStore) private readonly settlementStatusStore: gc.Settlements.SettlementStatusStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get payChipInfo(): TPayChipInfo {
        if (this.settlementStore.isFinishedShowResult) {
            const finish = {
                settlementResult: this.settlementStore.settlementResult,
                winningPlayers: this.settlementStore.winningPlayers,
            };

            return {
                finish,
                settleStatus: this.settlementStatusStore,
            };
        }

        return null;
    }
}
