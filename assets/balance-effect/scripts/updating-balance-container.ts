import { BitmapFont, CCFloat, Label, Node, _decorator, tween, v3 } from "cc";
import gc from "game-client-base";
import { NodeContainer } from "../../node-container/node-container";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export class UpdatingBalanceContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 3;

    @property(BitmapFont)
    fontIncreaseBalance: BitmapFont = null;

    @property(BitmapFont)
    fontDecreaseBalance: BitmapFont = null;

    updateBalance(playerNode: Node, win: boolean, value: number, startY = 80, destY = 10): void {
        const balanceEffectNode = this.createNode();
        const lblBalance = balanceEffectNode.getComponent(Label);
        lblBalance.string = `${win ? "+" : "-"}${FormatUtils.numberWithCommas(value, 2)}`;
        lblBalance.font = win ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.node.position = v3(0, startY, 0);
        playerNode.addChild(balanceEffectNode);
        tween(balanceEffectNode)
            .to(this.duration, { position: v3(0, startY + destY) })
            .destroySelf()
            .start();
    }
}
