import gc from "@sg/game-client-base";
import { Node, Sprite, SpriteFrame, _decorator, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { NodeContainer } from "../../shared/common-components/node-container/node-container";
import { AnimationUtils } from "../../shared/utils";
const { render, handle } = Observer;
const { ccclass, property } = _decorator;
const { GameCrash } = gc;

enum SpriteFrameIndex {
    MAIN_PLAYER = 0,
    OTHER_PLAYER = 1,
}

@ccclass
export class CashOutPlayerAnimation extends NodeContainer {
    @property({ type: SpriteFrame })
    spriteFrames: SpriteFrame[] = [];

    @render(GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    renderOtherPlayerCashOut() {
        const node = this.createCashoutPlayer();
        this.updateSpriteFrame(node, SpriteFrameIndex.OTHER_PLAYER);
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOut, { fireImmediately: false })
    renderMainPlayerCashOutFull(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashout) {
        cashOut && this.createCashoutMainPlayer();
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.halfCashOut, { fireImmediately: false })
    renderMainPlayerCashOutHalf(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashout) {
        cashOut && this.createCashoutMainPlayer();
    }

    createCashoutMainPlayer() {
        const node = this.createCashoutPlayer();
        this.updateSpriteFrame(node, SpriteFrameIndex.MAIN_PLAYER);
    }

    private updateSpriteFrame(node: Node, index: number) {
        const render = node.getComponent(Sprite);
        render.spriteFrame = this.spriteFrames[index];
    }

    private createCashoutPlayer() {
        const node = this.createNode();
        const randomPosition = v3(random(-100, 100), -random(200, 300));
        const duration = 2;
        const fadeDuration = 0.3;
        tween(node)
            .parallel(
                tween(node).to(duration, {
                    position: randomPosition,
                    eulerAngles: v3(0, 0, random(180, 360)),
                    scale: v3(1, 1).multiplyScalar(0.7),
                }),
                tween(node)
                    .delay(duration - fadeDuration)
                    .call(async () => {
                        await AnimationUtils.fadeOut(node, fadeDuration);
                        node?.destroy();
                    })
            )
            .start();
        return node;
    }
}
