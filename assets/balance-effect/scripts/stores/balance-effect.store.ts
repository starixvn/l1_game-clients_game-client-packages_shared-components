import inversify from "inversify";
import mobx from "mobx";
import { UpdatingBalanceContainer } from "../components/updating-balance-container";
import { WinningEffectContainer } from "../components/winning-effect-container";
const { injectable } = inversify;

@injectable()
export class BalanceEffectStore {
    private _balanceContainer: UpdatingBalanceContainer = null;
    private _winningContainer: WinningEffectContainer = null;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get balanceContainer() {
        return this._balanceContainer;
    }

    set balanceContainer(balanceContainer: UpdatingBalanceContainer) {
        this._balanceContainer = balanceContainer;
    }

    get winningContainer() {
        return this._winningContainer;
    }

    set winningContainer(winningContainer: WinningEffectContainer) {
        this._winningContainer = winningContainer;
    }
}
