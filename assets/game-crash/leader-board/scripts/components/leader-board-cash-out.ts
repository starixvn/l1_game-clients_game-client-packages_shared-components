import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

interface ILeaderBoardCashOutData {
    name: string;
    multiplier: number;
    win: number;
}

@ccclass
export class LeaderBoardCashOut extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashout: Label = null;

    setData(data: ILeaderBoardCashOutData) {
        const { name, multiplier, win } = data;
        this.lblName.string = name;
        this.lblMultiplier.string = multiplier ? `${FormatUtils.numberWithCommas(multiplier, 2, false)}x` : "-";
        this.lblCashout.string = FormatUtils.numberWithCommas(win, 2);
    }

    setCashOutEmpty() {
        this.lblCashout.string = "-";
    }
}
