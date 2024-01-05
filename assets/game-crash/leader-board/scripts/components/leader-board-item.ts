import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";

import { LeaderBoardCashOut } from "./leader-board-cash-out";

const { ccclass, property } = _decorator;
@ccclass
export class LeaderBoardItem extends Component {
    @property(LeaderBoardCashOut)
    cpnFullCashOut: LeaderBoardCashOut = null;

    @property(LeaderBoardCashOut)
    cpnHalfCashOut: LeaderBoardCashOut = null;

    onLoad() {
        this.setHalfCashOutDisplay(false);
    }

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { name, cashOut, halfCashOut, amount } = data;
        const customName = this.encryptedName(name);

        this.setHalfCashOutDisplay(false);

        if (halfCashOut && cashOut) {
            this.setHalfCashOutDisplay(true);
            this.cpnHalfCashOut.setData({
                name: customName,
                amount,
                multiplier: halfCashOut.multiplier,
                win: halfCashOut.win,
            });
            this.cpnFullCashOut.setData({
                name: customName,
                amount,
                multiplier: cashOut.multiplier,
                win: cashOut.win,
            });
        } else if (halfCashOut || cashOut) {
            const value = halfCashOut || cashOut;
            this.cpnFullCashOut.setData({
                name: customName,
                amount,
                multiplier: value.multiplier,
                win: value.win,
            });
        } else {
            this.cpnFullCashOut.setData({
                name: customName,
                amount,
            });
        }
    }

    setHalfCashOutDisplay(status: boolean) {
        this.cpnHalfCashOut.node.active = status;
    }

    isShowFullCashOutNode(): boolean {
        return this.cpnHalfCashOut.node.active;
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
