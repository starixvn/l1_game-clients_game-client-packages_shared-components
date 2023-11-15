import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";

import { ILeaderBoardItemData } from "../leader-board-data";

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

        this.lblHalfCashout.string = betAmount ? betAmount.toString() : "-";

        if ((halfCashOut && !cashOut) || (cashOut && !halfCashOut)) {
            const value = halfCashOut || cashOut;
            this.lblMultiplierWhenHalfCashOut.string = `${FormatUtils.numberWithCommas(value.multiplier, 2, false)}x`;
            this.lblHalfCashout.string = FormatUtils.numberWithCommas(value.win);
        } else if (halfCashOut && cashOut) {
            this.nodeCashOutContainer.active = true;
            this.lblMultiplier.string = `${FormatUtils.numberWithCommas(cashOut.multiplier, 2, false)}x`;
            this.lblCashout.string = FormatUtils.numberWithCommas(cashOut.win);
        } else {
            this.lblMultiplierWhenHalfCashOut.string = "-";
        }
    }

    setCashOutEmpty() {
        this.lblHalfCashout.string = "-";
    }
}
