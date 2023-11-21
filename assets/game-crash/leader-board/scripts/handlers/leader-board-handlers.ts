import gc from "@sg/game-client-base";
import inversify from "inversify";

import { LeaderBoardStore } from "../stores/leader-board-store";

const { injectable, inject } = inversify;
@injectable()
export class LeaderBoardHandler implements gc.Shared.IHandler<number> {
    @inject(LeaderBoardStore) private leaderBoardStore: LeaderBoardStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(gc.GameCrash.CrashCashOut.CrashCashoutStore) private readonly crashCashoutStore: gc.GameCrash.CrashCashOut.CrashCashoutStore;

    handle(data) {
        this.leaderBoardStore.otherPlayerList = data;
    }

    resetMainPlayer() {
        this.betStore.lastReceivedBet = { value: -1 };
        this.crashCashoutStore.cashOut = null;
        this.crashCashoutStore.halfCashOut = null;
        this.leaderBoardStore.isShowMainPlayerInfo = false;
    }

    showMainPlayerInfo() {
        this.leaderBoardStore.isShowMainPlayerInfo = true;
    }
}
