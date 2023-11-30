import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

interface ILeaderBoardCashOutData {
    name: string;
    multiplier: number;
    win: number;
    amount: number;
    isEmptyAmount: boolean;
}

@ccclass
export class LeaderBoardCashOut extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashout: Label = null;

    @property(Label)
    lblBetAmount: Label = null;

    setData(data: ILeaderBoardCashOutData) {
        const { name, multiplier, win, amount, isEmptyAmount } = data;
        this.lblName.string = name;
        this.lblMultiplier.string = multiplier ? `${FormatUtils.numberWithCommas(multiplier, 2, false)}x` : "-";

        this.lblCashout.node.active = false;
        this.lblBetAmount.node.active = false;

        if (win) {
            this.lblCashout.node.active = true;
            this.lblCashout.string = FormatUtils.numberWithCommas(win, 2);
        } else {
            this.lblBetAmount.node.active = true;
            this.lblBetAmount.string = isEmptyAmount ? "-" : FormatUtils.numberWithCommas(amount, 2);
        }
    }
}
