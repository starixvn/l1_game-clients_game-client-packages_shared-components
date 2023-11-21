import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

import { ILeaderBoardItemData } from "../leader-board-data";

const { injectable, inject } = inversify;

@injectable()
export class LeaderBoardStore {
    @inject(gc.Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(gc.GameCrash.CrashCashOut.CrashCashoutStore) private readonly crashCashoutStore: gc.GameCrash.CrashCashOut.CrashCashoutStore;

    private _otherPlayerList: ILeaderBoardItemData[] = [];
    private _isShowMainPlayerInfo = false;

    set otherPlayerList(otherPlayers: ILeaderBoardItemData[]) {
        this._otherPlayerList = otherPlayers;
    }

    get otherPlayerList(): ILeaderBoardItemData[] {
        return this._otherPlayerList.sort((a, b) => b.betAmount - a.betAmount);
    }

    get mainPlayer(): ILeaderBoardItemData {
        const bet = this.betStore.lastReceivedBet?.value;
        return {
            playerId: null,
            name: this.mainPlayerStore.name,
            betAmount: bet !== -1 ? bet : null,
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

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
