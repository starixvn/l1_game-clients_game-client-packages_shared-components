import { Component, _decorator } from "cc";

export interface IBetHistoryLog {
    time: string;
    round: number;
    win: number;
}
export default class BetHistoryBodyItem extends Component {
    setData(data: IBetHistoryLog, index: number) {}
}
