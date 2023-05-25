import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export type TEndBetInfo = {
    ownerAvatar: Node;
    bet: number;
    isProcessingBet: boolean;
};

@injectable()
export class UserProfileStore {
    private _ownerAvatar: Node = null;

    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get ownerAvatar() {
        return this._ownerAvatar;
    }

    set ownerAvatar(ownerAvatar: Node) {
        this._ownerAvatar = ownerAvatar;
    }

    get endBetInfo(): TEndBetInfo {
        return {
            ownerAvatar: this.ownerAvatar,
            bet: this.betStore.lastReceivedBet,
            isProcessingBet: this.betStore.isProcessingBet,
        };
    }
}
