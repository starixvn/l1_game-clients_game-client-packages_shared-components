import { CCFloat, _decorator, tween } from "cc";
import { NodeContainer } from "../../node-container/node-container";

const { ccclass, property } = _decorator;

@ccclass()
export class WinningEffectContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 3;

    playWinningEffect() {
        const winningEffectNode = this.createNode();
        this.node.addChild(winningEffectNode);
        tween(winningEffectNode).delay(this.duration).destroySelf().start();
    }
}
