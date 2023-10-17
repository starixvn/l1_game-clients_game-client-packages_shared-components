import gc from "@sg/game-client-base";
import { Label, Node, _decorator, tween, v3 } from "cc";
import { BalanceContainer } from "../../../../../game/balance-effect/scripts/components/balance-effect";
const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export class BalanceContainerInstant extends BalanceContainer {
    updateBalanceEffect(parent: Node, balance: number): void {
        const balanceEffectNode = new Node();
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${this.isIncrease ? "+" : "-"}${FormatUtils.numberWithCommas(balance, 2)}`;
        lblBalance.font = this.isIncrease ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.lineHeight = 130;
        lblBalance.fontSize = 40;
        lblBalance.node.position = v3(0, this.startY, 0);
        parent.addChild(balanceEffectNode);
        tween(balanceEffectNode)
            .to(this.duration, { position: v3(0, this.startY + this.destY) })
            .destroySelf()
            .start();
    }
}
