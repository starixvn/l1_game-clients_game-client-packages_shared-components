import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label, Node } from "cc";

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
    nodeHalfCashOutContainer: Node = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblCashout: Label = null;

    onLoad() {
        this.setHalfCashOutVisibility(false);
    }

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer, isMainPlayer = false) {
        const { name, cashOut, halfCashOut, amount } = data;

        this.nodeHalfCashOutContainer.active = false;
        this.lblName.string = isMainPlayer ? name : this.encryptedName(name);
        isMainPlayer && (this.lblName.color = new Color().fromHEX("#52faf8"));

        if ((halfCashOut && !cashOut) || (cashOut && !halfCashOut)) {
            const value = halfCashOut || cashOut;
            this.updateCashOut(value, true);
        } else if (halfCashOut && cashOut) {
            this.setHalfCashOutVisibility(true);
            this.updateCashOut(cashOut, true);
            this.updateCashOut(halfCashOut, false);
        } else {
            this.lblMultiplier.string = "-";
            this.lblCashout.string = FormatUtils.numberWithCommas(amount, 2);
        }
    }

    setCashOutEmpty() {
        this.lblHalfCashout.string = "-";
    }

    isShowHalfCashOutContainerNode(): boolean {
        return this.nodeHalfCashOutContainer.active;
    }

    setHalfCashOutVisibility(status: boolean) {
        this.nodeHalfCashOutContainer.active = status;
    }

    private updateCashOut(data: gc.GameCrash.GameCrashServiceMessage.CashOutReceive, isFirstRow: boolean) {
        const lblMultiplier = isFirstRow ? this.lblMultiplier : this.lblMultiplierWhenHalfCashOut;
        const lblCashout = isFirstRow ? this.lblCashout : this.lblHalfCashout;
        lblMultiplier.string = `${FormatUtils.numberWithCommas(data.multiplier, 2, false)}x`;
        lblCashout.string = FormatUtils.numberWithCommas(data.win, 2);
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
