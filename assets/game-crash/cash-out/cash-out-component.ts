import gc from "@sg/game-client-base";
import { Label, Node, Sprite } from "cc";

const { FormatUtils } = gc;
export namespace CashOutComponent {
    export const setDisplayNode = (node: Node, visibleCashOut: boolean) => {
        if (visibleCashOut) {
            node.active = true;
        } else {
            node.active = false;
        }
    };

    export const getBetValue = (lastReceivedBet: any) => {
        return lastReceivedBet && lastReceivedBet.value >= 0 ? lastReceivedBet.value : undefined;
    };

    export const updateCashOutButtonStatus = (isCashedOut: boolean, sprDisabled: Sprite) => {
        sprDisabled.node.active = isCashedOut;
    };

    export const getCashOutValue = (lblCashOut: Label) => {
        return +lblCashOut.string;
    };

    export const updateValueCashOut = (cashOutValue: number, lblCashOut: Label) => {
        lblCashOut.string = FormatUtils.numberWithCommas(cashOutValue, 2);
    };
}
