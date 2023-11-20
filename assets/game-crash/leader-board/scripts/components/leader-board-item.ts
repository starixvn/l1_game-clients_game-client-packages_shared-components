import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";

import { ICashOutData, ILeaderBoardItemData } from "../leader-board-data";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;
@ccclass
export class LeaderBoardItem extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblMultiplierWhenHalfCashOut: Label = null;

    @property(Label)
    lblHalfCashout: Label = null;

    @property(Node)
    nodeCashOutContainer: Node = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashout: Label = null;

    onLoad() {
        this.nodeCashOutContainer.active = false;
    }

    setData(data: ILeaderBoardItemData, isMainPlayer = false) {
        const { name, cashOut, halfCashOut, betAmount } = data;

        this.nodeCashOutContainer.active = false;
        this.lblName.string = name;
        isMainPlayer && (this.lblName.color = new Color().fromHEX("#52faf8"));

        if ((halfCashOut && !cashOut) || (cashOut && !halfCashOut)) {
            const value = halfCashOut || cashOut;
            this.updateCashOut(value, true);
        } else if (halfCashOut && cashOut) {
            this.nodeCashOutContainer.active = true;
            this.updateCashOut(cashOut, true);
            this.updateCashOut(halfCashOut, false);
        } else {
            this.lblMultiplier.string = "-";
            this.lblCashout.string = betAmount.toString();
        }
    }

    setCashOutEmpty() {
        this.lblHalfCashout.string = "-";
    }

    private updateCashOut(data: ICashOutData, isFirstRow: boolean) {
        const lblMultiplier = isFirstRow ? this.lblMultiplier : this.lblMultiplierWhenHalfCashOut;
        const lblCashout = isFirstRow ? this.lblCashout : this.lblHalfCashout;
        lblMultiplier.string = `${FormatUtils.numberWithCommas(data.multiplier, 2, false)}x`;
        lblCashout.string = FormatUtils.numberWithCommas(data.win, 2);
    }
}
