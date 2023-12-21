import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { AutoPlayStore } from "../auto-play/scripts/stores/auto-play-store";
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
    @inject(gc.GameCrash.CrashCashOut.CrashCashOutStore)
    protected readonly crashCashoutStore: gc.GameCrash.CrashCashOut.CrashCashOutStore;

    @inject(AutoPlayStore)
    protected readonly autoPlayStore: AutoPlayStore;

    @inject(EarlyBetStore)
    protected readonly earlyBetStore: EarlyBetStore;

    @inject(gc.Bet.BetStore)
    protected readonly betStore: gc.Bet.BetStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    @inject(gc.Rounds.RoundStore)
    protected readonly roundStore: gc.Rounds.RoundStore;

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

    get endShowCashOutNotice(): boolean {
        return this._endShowCashOutNotice;
    }

    set endShowCashOutNotice(flag: boolean) {
        this._endShowCashOutNotice = flag;
    }

    get visibleBetNextRound() {
        return (
            (this.betState === BET_STATE.NONE &&
                (this.isFlyingTime || this.roundTimeStore.isShowResult || this.roundTimeStore.isStartRound)) ||
            (this.cashOutState === CASH_OUT_STATE.FULL && this.endShowCashOutNotice)
        );
    }

    get permissionAutoPlay() {
        return this.cashOutState === CASH_OUT_STATE.FULL && this.betState === BET_STATE.BET;
    }

    get isFlyingTime() {
        return this.roundTimeStore.roundTime <= 0;
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

    get disableBetAmount() {
        return (
            this.earlyBetState === EARLY_BET_STATE.BET ||
            this.visibleCashOut ||
            this.autoPlayStore.roundsAutoPlay > 0 ||
            (this.latestRound && this.roundTimeStore.isStartPlacingBet) ||
            (this.betState === BET_STATE.BET && (this.roundTimeStore.isPlacingBet || this.roundTimeStore.isLocking))
        );
    }

    get waitingBet(): boolean {
        return this._waitingBet;
    }

    set waitingBet(enable: boolean) {
        this._waitingBet = enable;
    }

    get activeAutoPlayCurrentRound() {
        return this.enableAutoPlay && this.roundTimeStore.isPlacingBet && !this.roundTimeStore.isLocking && !this.activeAutoPlay;
    }

    get autoEarlyBet() {
        return this.autoPlayStore.isAutoPlay && this.autoPlayStore.roundsAutoPlay > 0;
    }

    get latestRound() {
        return this.autoPlayStore.isAutoPlay && this.autoPlayStore.roundsAutoPlay === 0;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
