import { BitmapFont, CCFloat, Label, Node, _decorator, tween, v3 } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import gc from "game-client-base";
import Observer from "observer";
import { BalanceEffectHandlers } from "../handlers/balance-effect-handlers";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass()
export class UpdatingBalanceContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 1;

    @property(BitmapFont)
    fontIncreaseBalance: BitmapFont = null;

    @property(BitmapFont)
    fontDecreaseBalance: BitmapFont = null;

    onLoad() {
        super.onLoad();
        this.setBalanceContainer();
    }

    @handle(BalanceEffectHandlers.SetBalanceContainer)
    setBalanceContainer() {
        return this;
    }

    updateBalance(node: Node, win: boolean, value: number, duration = this.duration, startY = 0, destY = 100): void {
        const balanceEffectNode = new Node();
        const lblBalance = balanceEffectNode.addComponent(Label);
        lblBalance.string = `${win ? "+" : "-"}${FormatUtils.numberWithCommas(value, 2)}`;
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
