import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { MainPlayerProfileStore } from "../../../main-player-profile/scripts/stores/main-player-profile-store";
const { injectable, inject } = inversify;

export type TBalanceEffect = {
    avatarNode: Node;
    balance: number;
};

export type TUpdateBalance = {
    balanceEffect: TBalanceEffect;
};

export type TWinningEffect = {
    avatarNode: Node;
    status: boolean;
};

export type TWinningEffects = {
    winningEffects: TWinningEffect[];
};

export type TUpdateBalances = {
    balanceEffects: TBalanceEffect[];
};

@injectable()
export class BalanceEffectStore {
    betBalanceMainPlayer: TUpdateBalance = null;
    payoutBalanceMainPlayer: TUpdateBalance = null;
    winEffectMainPlayer: TWinningEffect = null;
    winEffectAroundTablePlayers: TWinningEffects = null;
    payoutBalanceAroundTablePlayers: TUpdateBalances = null;

    @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    updateBetBalanceMainPlayer(balance: number) {
        const balanceEffect = { balance, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.betBalanceMainPlayer = { balanceEffect };
    }

    updatePayoutBalanceMainPlayer(balance: number) {
        const balanceEffect = { balance, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.payoutBalanceMainPlayer = { balanceEffect };
    }

    updateWinEffectMainPlayer(status: boolean) {
        this.winEffectMainPlayer = { status, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
    }

    updateWinEffectAroundTablePlayer(winningEffects: TWinningEffect[]) {
        this.winEffectAroundTablePlayers = { winningEffects };
    }

    updatePayoutBalanceAroundTablePlayer(balanceEffects: TBalanceEffect[]) {
        this.payoutBalanceAroundTablePlayers = { balanceEffects };
    }
}
