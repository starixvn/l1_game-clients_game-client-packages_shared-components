import { BitmapFont, CCFloat, Label, Node, _decorator, tween, v3 } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import gc from "game-client-base";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export class UpdatingBalanceContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 1;

    @property(BitmapFont)
    fontIncreaseBalance: BitmapFont = null;

    @property(BitmapFont)
    fontDecreaseBalance: BitmapFont = null;

    @property(CCFloat)
    startY = 0;

    @property(CCFloat)
    destY = 100;

    updateBalance(parent: Node, win: boolean, balance: number): void {
        const balanceEffectNode = new Node();
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${win ? "+" : "-"}${FormatUtils.numberWithCommas(balance, 2)}`;
        lblBalance.font = win ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.lineHeight = 130;
        lblBalance.fontSize = 30;
        lblBalance.node.position = v3(0, this.startY, 0);
        parent.addChild(balanceEffectNode);
        tween(balanceEffectNode)
            .to(this.duration, { position: v3(0, this.startY + this.destY) })
            .destroySelf()
            .start();
    }
}
