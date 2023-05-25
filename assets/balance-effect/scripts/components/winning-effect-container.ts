import { CCFloat, _decorator, tween } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import Observer from "observer";
import { BalanceEffectStore } from "./../stores/balance-effect.store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class WinningEffectContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 3;

    @render(BalanceEffectStore, (store) => store.playWinningEffect, { fireImmediately: false })
    playWinningEffect() {
        const winningEffectNode = this.createNode();
        this.node.addChild(winningEffectNode);
        tween(winningEffectNode).delay(this.duration).destroySelf().start();
    }
}
