import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { MainPlayerProfileStore } from "../../../main-player-profile/scripts/stores/main-player-profile-store";
const { injectable, inject } = inversify;

export type TBalanceEffect = {
    ownerAvatar: Node;
    balance: number;
};

export type TUpdateBalance = {
    balanceEffect: TBalanceEffect;
};

export type TWinningEffect = {
    status: boolean;
};

@injectable()
export class BalanceEffectStore {
    balanceWhenBet: TUpdateBalance = null;
    balanceWhenPayout: TUpdateBalance = null;
    playWinningEffect: TWinningEffect = null;

    @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    updateBalanceWhenBet(balance: number) {
        const balanceEffect = { balance, ownerAvatar: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.balanceWhenBet = { balanceEffect };
    }

    updateBalanceWhenPayout(balance: number) {
        const balanceEffect = { balance, ownerAvatar: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.balanceWhenPayout = { balanceEffect };
    }

    handlePlayWinningEffect(status: boolean) {
        this.playWinningEffect = { status };
    }
}
