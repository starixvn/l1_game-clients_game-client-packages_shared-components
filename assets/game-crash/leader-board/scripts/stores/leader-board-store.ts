import inversify from "inversify";
import mobx from "mobx";

import { ILeaderBoardItemData } from "../leader-board-data";

const { injectable, inject } = inversify;

@injectable()
export class LeaderBoardStore {
    private _otherPlayerList: ILeaderBoardItemData[] = [];

    set otherPlayerList(data: ILeaderBoardItemData) {
        this._otherPlayerList.push(data);
    }

    get otherPlayerList(): ILeaderBoardItemData[] {
        return this._otherPlayerList?.sort((a, b) => b.cashOut - a.cashOut);
    }

    resetOtherPlayerList() {
        this._otherPlayerList = [];
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
