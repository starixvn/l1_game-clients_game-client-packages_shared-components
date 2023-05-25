import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;

export type TBalanceEffect = {
    node: Node;
    win: boolean;
    ballance: number;
    duration: number;
    startY?: number;
    destY?: number;
};

export type TUpdateBalance = {
    balanceEffect: TBalanceEffect;
};

export type TWinningEffect = {
    status: boolean;
};

@injectable()
export class BalanceEffectStore {
    updateBalance: TUpdateBalance = null;
    playWinningEffect: TWinningEffect = null;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    handleUpdateBalance(balanceEffect: TBalanceEffect) {
        this.updateBalance = { balanceEffect };
    }

    handlePlayWinningEffect(status: boolean) {
        this.playWinningEffect = { status };
    }
}
