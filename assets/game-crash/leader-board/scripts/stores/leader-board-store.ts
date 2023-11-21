import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

const { Player, Bet, GameCrash } = gc;

@injectable()
export class LeaderBoardStore {
    @inject(Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(GameCrash.CrashCashOut.CrashCashoutStore) private readonly crashCashoutStore: gc.GameCrash.CrashCashOut.CrashCashoutStore;

    private _isShowMainPlayerInfo = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get mainPlayer(): gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer {
        const bet = this.betStore.lastReceivedBet?.value;
        return {
            playerId: null,
            name: this.mainPlayerStore.name,
            amount: bet !== -1 ? bet : null,
            cashOut: this.crashCashoutStore.cashOut,
            halfCashOut: this.crashCashoutStore.halfCashOut,
        };
    }

    set isShowMainPlayerInfo(isShow: boolean) {
        this._isShowMainPlayerInfo = isShow;
    }

    get isShowMainPlayerInfo(): boolean {
        return this._isShowMainPlayerInfo;
    }
}
