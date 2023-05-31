import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { UserProfileStore } from "../../../user-profile/scripts/stores/user-profile-store";
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

    @inject(UserProfileStore) private readonly userProfileStore: UserProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    updateBalanceWhenBet(balance: number) {
        const balanceEffect = { balance, ownerAvatar: this.userProfileStore.mainPlayerAvatarNode };
        this.balanceWhenBet = { balanceEffect };
    }

    updateBalanceWhenPayout(balance: number) {
        const balanceEffect = { balance, ownerAvatar: this.userProfileStore.mainPlayerAvatarNode };
        this.balanceWhenPayout = { balanceEffect };
    }

    handlePlayWinningEffect(status: boolean) {
        this.playWinningEffect = { status };
    }
}
