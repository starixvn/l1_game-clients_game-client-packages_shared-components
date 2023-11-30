import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { EarlyBetStore } from "../bet/early-bet-store";

const { injectable, inject } = inversify;

export const BET_STATE = {
    NONE: "none",
    BET: "bet",
};

export const EARLY_BET_STATE = {
    NONE: "none",
    BET: "bet",
};

export const CASH_OUT_STATE = {
    NONE: "none",
    HALF: "half",
    FULL: "full",
};

@injectable()
export class PlayerActionStore {
    @inject(gc.GameCrash.CrashCashOut.CrashCashoutStore)
    protected readonly crashCashoutStore: gc.GameCrash.CrashCashOut.CrashCashoutStore;

    @inject(AutoPlayStore)
    protected readonly autoPlayStore: AutoPlayStore;

    @inject(EarlyBetStore)
    protected readonly earlyBetStore: EarlyBetStore;

    @inject(gc.Bet.BetStore)
    protected readonly betStore: gc.Bet.BetStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    private _endShowCashOutNotice = false;

    private _waitingBet = false;

    private _activeAutoPlay = false;

    private _enableAutoPlay = false;

    private _earlyBetState = EARLY_BET_STATE.NONE;

    private _cashOutState = CASH_OUT_STATE.NONE;

    private _betState = BET_STATE.NONE;

    get enableAutoPlay() {
        return this._enableAutoPlay;
    }

    set enableAutoPlay(value: boolean) {
        this._enableAutoPlay = value;
    }

    get activeAutoPlay() {
        return this._activeAutoPlay;
    }

    set activeAutoPlay(value: boolean) {
        this._activeAutoPlay = value;
    }

    get earlyBetState() {
        return this._earlyBetState;
    }

    set earlyBetState(value: string) {
        this._earlyBetState = value;
    }

    get cashOutState() {
        return this._cashOutState;
    }

    set cashOutState(value: string) {
        this._cashOutState = value;
    }

    get betState() {
        return this._betState;
    }

    set betState(value: string) {
        this._betState = value;
    }

    get endShowCashoutNotice(): boolean {
        return this._endShowCashOutNotice;
    }

    set endShowCashoutNotice(flag: boolean) {
        this._endShowCashOutNotice = flag;
    }

    get visibleBetNextRound() {
        return (
            (this.betState === BET_STATE.NONE && this.isFlyingTime) ||
            (this.cashOutState === CASH_OUT_STATE.FULL && this.endShowCashoutNotice)
        );
    }

    get permissionAutoPlay() {
        return this.cashOutState === CASH_OUT_STATE.FULL && this.betState === BET_STATE.BET;
    }

    get isFlyingTime() {
        return this.roundTimeStore.remaining <= 0;
    }

    get rocketStart() {
        return this.roundTimeStore.remaining === 0;
    }

    get visibleCashOut() {
        return (
            (this.betState === BET_STATE.BET && this.isFlyingTime && !this.visibleBetNextRound) ||
            (this.betState === BET_STATE.BET &&
                this.cashOutState !== CASH_OUT_STATE.FULL &&
                (this.roundTimeStore.isShowResult || this.roundTimeStore.isStartRound))
        );
    }

    get visibleAutoCashOut() {
        return this.visibleBetNextRound || !this.visibleCashOut;
    }

    get visibleBetAmount() {
        return this.earlyBetState === EARLY_BET_STATE.BET || this.visibleCashOut;
    }

    get waitingBet(): boolean {
        return this._waitingBet;
    }

    set waitingBet(enable: boolean) {
        this._waitingBet = enable;
    }

    get activeAutoPlayCurrentRound() {
        return this.enableAutoPlay && this.roundTimeStore.isPlacingBet;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
