import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";

import { LeaderBoardCashOut } from "./leader-board-cash-out";

const { ccclass, property } = _decorator;
@ccclass
export class LeaderBoardItem extends Component {
    @property(LeaderBoardCashOut)
    firstRow: LeaderBoardCashOut = null;

    @property(LeaderBoardCashOut)
    secondRow: LeaderBoardCashOut = null;

    onLoad() {
        this.setSecondRowDisplay(false);
    }

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { name, cashOut, halfCashOut, amount } = data;
        const customName = this.encryptedName(name);

        this.setSecondRowDisplay(false);

        if (halfCashOut && cashOut) {
            this.firstRow.setData({
                name: customName,
                amount,
                multiplier: cashOut.multiplier,
                win: cashOut.win,
            });

            this.setSecondRowDisplay(true);
            this.secondRow.setData({
                name: customName,
                amount,
                multiplier: halfCashOut.multiplier,
                win: halfCashOut.win,
            });
        } else if (halfCashOut || cashOut) {
            const value = halfCashOut || cashOut;
            this.firstRow.setData({
                name: customName,
                amount,
                multiplier: value.multiplier,
                win: value.win,
            });
        } else {
            this.firstRow.setData({
                name: customName,
                amount,
            });
        }
    }

    setSecondRowDisplay(status: boolean) {
        this.secondRow.node.active = status;
    }

    isShowSecondRow(): boolean {
        return this.secondRow.node.active;
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
