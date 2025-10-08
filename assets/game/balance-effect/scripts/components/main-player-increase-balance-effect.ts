import { _decorator, Node, UITransform, Layers, Label, tween, v3 } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "../stores/balance-effect-store";
import { BalanceContainer } from "./balance-effect";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class MainPlayerIncreaseBalanceEffect extends BalanceContainer {

    @property(Node)
    floatUpBalanceNode: Node = null;

    @render(BalanceEffectStore, (store) => store.increaseBalanceMainPlayer, { fireImmediately: false })
    increaseBalanceMainPlayer(balanceWhenMainPlayerPayout: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerPayout?.balanceEffect);
    }

    updateBalanceEffect(parent: Node, balance: number): void {
        if (!this.floatUpBalanceNode) {
            super.updateBalanceEffect(parent, balance);
            return;
        }

        const sourceTransform = this.floatUpBalanceNode.getComponent(UITransform);
        const parentTransform = parent?.getComponent(UITransform);

        if (!sourceTransform || !parentTransform) {
            super.updateBalanceEffect(parent, balance);
            return;
        }

        const balanceEffectNode = new Node();
        balanceEffectNode.layer = Layers.Enum.UI_2D;
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${this.isIncrease ? "+" : "-"}${FormatUtils.numberWithCommas(balance, 2)}`;
        lblBalance.font = this.isIncrease ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.lineHeight = 130;
        lblBalance.fontSize = this.fontSize;

        const worldPos = sourceTransform.convertToWorldSpaceAR(v3(0, 0, 0));
        const localPos = parentTransform.convertToNodeSpaceAR(worldPos);
        localPos.y += this.startY;
        balanceEffectNode.position = localPos;

        parent.addChild(balanceEffectNode);
        const startPos = balanceEffectNode.position.clone();
        tween(balanceEffectNode)
            .to(this.duration, { position: v3(startPos.x, startPos.y + this.destY, startPos.z) })
            .destroySelf()
            .start();
    }
}
