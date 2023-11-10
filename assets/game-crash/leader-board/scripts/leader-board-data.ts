export interface ILeaderBoardItemData {
    playerId: string;
    name: string;
    cashOut?: ICashOutData;
    halfCashOut?: ICashOutData;
    betAmount?: number;
}

export interface ICashOutData {
    win: number;
    multiplier: number;
}
