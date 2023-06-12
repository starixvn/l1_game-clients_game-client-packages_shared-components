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
    decreaseBalanceMainPlayer: TUpdateBalance = null;
    increaseBalanceMainPlayer: TUpdateBalance = null;
    winEffectMainPlayer: TWinningEffect = null;
    winEffectAroundTablePlayers: TWinningEffects = null;
    decreaseBalanceAroundTablePlayers: TUpdateBalances = null;

    @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    updateMainPlayerDecreaseBalance(balance: number) {
        const balanceEffect = { balance, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.decreaseBalanceMainPlayer = { balanceEffect };
    }

    updateMainPlayerIncreaseBalance(balance: number) {
        const balanceEffect = { balance, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
        this.increaseBalanceMainPlayer = { balanceEffect };
    }

    updateMainPlayerWinEffect(status: boolean) {
        this.winEffectMainPlayer = { status, avatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode };
    }

    updateAroundTablePlayersWinEffect(winningEffects: TWinningEffect[]) {
        this.winEffectAroundTablePlayers = { winningEffects };
    }

    updateAroundTablePlayersDecreaseBalance(balanceEffects: TBalanceEffect[]) {
        this.decreaseBalanceAroundTablePlayers = { balanceEffects };
    }
}
