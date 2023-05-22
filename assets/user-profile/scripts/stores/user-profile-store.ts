import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { UpdatingBalanceContainer } from "../../../balance-effect/scripts/components/updating-balance-container";
import { BalanceEffectStore } from "../../../balance-effect/scripts/stores/balance-effect.store";
const { injectable, inject } = inversify;

export type TEndBetInfo = {
    ownerAvatar: Node;
    balanceContainer: UpdatingBalanceContainer;
    bet: number;
    isProcessingBet: boolean;
};

@injectable()
export class UserProfileStore {
    private _ownerAvatar: Node = null;

    @inject(BalanceEffectStore) private readonly balanceEffectStore: BalanceEffectStore;
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
            balanceContainer: this.balanceEffectStore.balanceContainer,
            bet: this.betStore.lastReceivedBet,
            isProcessingBet: this.betStore.isProcessingBet,
        };
    }
}
