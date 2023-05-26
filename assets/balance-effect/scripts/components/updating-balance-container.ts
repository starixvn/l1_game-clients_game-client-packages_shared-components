import { BitmapFont, CCFloat, Label, Node, _decorator, tween, v3 } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import gc from "game-client-base";
import Observer from "observer";
import { BalanceEffectStore } from "../stores/balance-effect.store";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class UpdatingBalanceContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 1;

    @property(BitmapFont)
    fontIncreaseBalance: BitmapFont = null;

    @property(BitmapFont)
    fontDecreaseBalance: BitmapFont = null;

    winningDuration = 3;

    @render(BalanceEffectStore, (store) => store.balanceWhenBet, { fireImmediately: false })
    updateBalanceWhenBet(balanceWhenBet: any) {
        if (balanceWhenBet) {
            const { ownerAvatar, balance } = balanceWhenBet.balanceEffect;
            this.updateBalance(ownerAvatar, false, balance, 1, 80);
        }
    }

    @render(BalanceEffectStore, (store) => store.balanceWhenPayout, { fireImmediately: false })
    updateBalanceWhenPayout(balanceWhenPayout: any) {
        if (balanceWhenPayout) {
            const { ownerAvatar, balance } = balanceWhenPayout.balanceEffect;
            this.updateBalance(ownerAvatar, true, balance, this.winningDuration, 80, 10);
        }
    }

    updateBalance(node: Node, win: boolean, balance: number, duration: number, startY = 0, destY = 100): void {
        const balanceEffectNode = new Node();
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${win ? "+" : "-"}${FormatUtils.numberWithCommas(balance, 2)}`;
        lblBalance.font = win ? this.fontIncreaseBalance : this.fontDecreaseBalance;
        lblBalance.lineHeight = 130;
        lblBalance.fontSize = 30;
        lblBalance.node.position = v3(0, startY, 0);
        node.addChild(balanceEffectNode);
        tween(balanceEffectNode)
            .to(duration, { position: v3(0, startY + destY) })
            .destroySelf()
            .start();
    }
}
