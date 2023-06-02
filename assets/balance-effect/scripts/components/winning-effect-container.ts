import { CCFloat, _decorator, tween } from "cc";
import { NodeContainer } from "db://shared-components/node-container/node-container";
import Observer from "observer";
import { BalanceEffectStore, TWinningEffect } from "./../stores/balance-effect.store";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass()
export class WinningEffectContainer extends NodeContainer {
    @property(CCFloat)
    duration: number = 3;

    @render(BalanceEffectStore, (store) => store.winEffectMainPlayer, { fireImmediately: false })
    playWinningEffectMainPlayer(playWinningEffectMainPlayer: TWinningEffect) {
        this.playWinningEffect(playWinningEffectMainPlayer);
    }

    @render(BalanceEffectStore, (store) => store.winEffectAroundTablePlayers, { fireImmediately: false })
    playWinningEffectAroundTablePlayer(playWinningEffectAroundTablePlayers: TWinningEffect[]) {
        playWinningEffectAroundTablePlayers.forEach((playWinningEffectAroundTablePlayer) => {
            this.playWinningEffect(playWinningEffectAroundTablePlayer);
        });
    }

    playWinningEffect(playWinningEffectMainPlayer: TWinningEffect) {
        const { avatarNode } = playWinningEffectMainPlayer ?? {};
        const winningEffectNode = this.createNode();
        avatarNode.addChild(winningEffectNode);
        tween(winningEffectNode).delay(this.duration).destroySelf().start();
    }
}
