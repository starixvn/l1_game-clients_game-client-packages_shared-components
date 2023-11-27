import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { Md5PopupStore } from "../md5-popup/scripts/stores/md5-popup-store";

const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

export interface CrashRoundHistory extends gc.RoundHistories.RoundHistory {
    md5Result?: any;
}

@injectable()
export class CrashRoundHistoryStore {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(gc.RoundHistories.RoundHistoryStore) protected readonly roundHistoryStore: gc.RoundHistories.RoundHistoryStore;
    @inject(gc.Rounds.RoundStore) protected readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.Settlements.SettlementStore) protected readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(Md5PopupStore) protected readonly md5PopupStore: Md5PopupStore;
    private _lastRound: CrashRoundHistory = { roundId: 0, result: {}, md5Result: {}, settlementResult: {} };
    private _roundIndex = 0;
    get roundHistories() {
        let roundHistoy = [];

        let lastRoundId = this.roundHistoryStore.histories[0]?.roundId;
        if (lastRoundId === this.lastRound.roundId) {
            roundHistoy = this.roundHistoryStore.histories as CrashRoundHistory[];
            if (!this.settlementStore.currentFinish) {
                roundHistoy = [this.lastRound, ...(this.roundHistoryStore.histories as CrashRoundHistory[])];
            }
        } else {
            roundHistoy = [this.lastRound, ...(this.roundHistoryStore.histories as CrashRoundHistory[])];
        }

        return roundHistoy;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get md5PopupData() {
        const roundItem = this.roundHistories.find((obj) => {
            return obj.roundId === this.md5PopupStore.roundId;
        });
        this._roundIndex = this.roundHistories.findIndex((obj) => obj.roundId === this.md5PopupStore.roundId);
        return roundItem;
    }

    get lastRound() {
        const resultHash = this.roundStore.resultHash;
        if (resultHash) {
            if (resultHash.hashValue) {
                this._lastRound.md5Result["hashValue"] = resultHash.hashValue;
                delete this._lastRound.md5Result["rawValue"];
            }
            if (resultHash.rawValue) {
                this._lastRound.md5Result["rawValue"] = resultHash.rawValue;
            }
        }
        this._lastRound.roundId = this.roundStore.clientRoundId;

        this.settlementStore.currentFinish && (this._lastRound.result = this.settlementStore.currentFinish.result);

        return {
            md5Result: this._lastRound.md5Result,
            result: this._lastRound.result,
            roundId: this._lastRound.roundId,
        };
    }
    get increaseStatus(): boolean {
        return this._roundIndex > 0 || this._roundIndex === -1;
    }

    get descreaseStatus(): boolean {
        if (this._roundIndex === -1) {
            return false;
        }
        return this._roundIndex < this.roundHistoryStore.histories.length - 1;
    }
}
