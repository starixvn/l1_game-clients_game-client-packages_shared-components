import gc from "@sg/game-client-base";
import inversify from "inversify";

import { LeaderBoardStore } from "../stores/leader-board-store";

const { injectable, inject } = inversify;
@injectable()
export class LeaderBoardHandler implements gc.Shared.IHandler<number> {
    @inject(LeaderBoardStore) private leaderBoardStore: LeaderBoardStore;

    handle(data) {
        this.leaderBoardStore.otherPlayerList = data;
    }
}
