import { CCFloat, _decorator, tween } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import Observer from "observer";
import { BalanceEffectHandlers } from "../handlers/balance-effect-handlers";

const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass()
export class WinningEffectContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 3;

    onLoad() {
        super.onLoad();
        this.setWinningContainer();
    }

    @handle(BalanceEffectHandlers.WinningContainer)
    setWinningContainer() {
        return this;
    }

    playWinningEffect() {
        const winningEffectNode = this.createNode();
        this.node.addChild(winningEffectNode);
        tween(winningEffectNode).delay(this.duration).destroySelf().start();
    }
}
