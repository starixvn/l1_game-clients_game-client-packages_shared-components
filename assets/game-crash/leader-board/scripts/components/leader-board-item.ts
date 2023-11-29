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
        this.setHalfCashOutVisibility(false);
    }

    setData(data: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer, isMainPlayer = false) {
        const { name, cashOut, halfCashOut, amount } = data;
        const customName = isMainPlayer ? name : this.encryptedName(name);

        this.setHalfCashOutVisibility(false);
        if ((halfCashOut && !cashOut) || (cashOut && !halfCashOut)) {
            const value = halfCashOut || cashOut;
            this.cpnFullCashOut.setData({ name: customName, multiplier: value.multiplier, win: value.win });
        } else if (halfCashOut && cashOut) {
            this.setHalfCashOutVisibility(true);
            this.cpnHalfCashOut.setData({ name: customName, multiplier: halfCashOut.multiplier, win: halfCashOut.win });
            this.cpnFullCashOut.setData({ name: customName, multiplier: cashOut.multiplier, win: cashOut.win });
        } else {
            this.cpnFullCashOut.setData({ name: customName, multiplier: null, win: amount });
        }
    }

    setCashOutEmpty() {
        this.cpnFullCashOut.setCashOutEmpty();
    }

    setHalfCashOutVisibility(status: boolean) {
        this.cpnHalfCashOut.node.active = status;
    }

    isShowFullCashOutNode(): boolean {
        return this.cpnHalfCashOut.node.active;
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
