import { _decorator, Color, Component, Label, Node } from "cc";

import { ILeaderBoardItemData } from "../leader-board-data";

const { ccclass, property } = _decorator;

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

    setData(data: ILeaderBoardItemData, isMainPlayer = false) {
        const { name, cashOut, halfCashOut, betAmount } = data;

        this.nodeCashOutContainer.active = false;
        this.lblName.string = name;
        isMainPlayer && (this.lblName.color = new Color().fromHEX("#52faf8"));

        this.lblHalfCashout.string = betAmount ? betAmount.toString() : "-";

        if (halfCashOut) {
            this.lblMultiplierWhenHalfCashOut.string = halfCashOut.multiplier.toString();
            this.lblHalfCashout.string = halfCashOut.win.toString();
        } else if (cashOut) {
            this.lblMultiplierWhenHalfCashOut.string = cashOut.multiplier.toString();
            this.lblHalfCashout.string = cashOut.win.toString();
        } else {
            this.lblMultiplierWhenHalfCashOut.string = "-";
        }

        if (halfCashOut && cashOut) {
            this.nodeCashOutContainer.active = true;
            this.lblMultiplier.string = cashOut.multiplier.toString();
            this.lblCashout.string = cashOut.win.toString();
        }
    }

    resetMultiplierAndCashOut() {
        this.lblMultiplierWhenHalfCashOut.string = "-";
        this.lblHalfCashout.string = "-";
    }
}
