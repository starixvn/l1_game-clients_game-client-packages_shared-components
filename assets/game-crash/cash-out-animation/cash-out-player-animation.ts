import gc from "@sg/game-client-base";
import { Node, Sprite, SpriteFrame, _decorator, sp, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { NodeContainer } from "../../shared/common-components/node-container/node-container";
import { AnimationUtils } from "../../shared/utils";
const { render } = Observer;
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
    async renderOtherPlayerCashOut() {
        await this.createCashOutPlayer(true);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, { fireImmediately: false })
    renderMainPlayerCashOutFull(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        cashOut && this.createCashOutMainPlayer();
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOut, { fireImmediately: false })
    renderMainPlayerCashOutHalf(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        cashOut && this.createCashOutMainPlayer();
    }

    async createCashOutMainPlayer() {
        const node = await this.createCashOutPlayer(true);
        this.updateSpriteFrame(node, SpriteFrameIndex.MAIN_PLAYER);
    }

    private updateSpriteFrame(node: Node, index: number) {
        const render = node.getComponent(Sprite);
        render.spriteFrame = this.spriteFrames[index];
    }

    private async createCashOutPlayer(isMainPlayer = false) {
        const node = this.createNode();
        const randomPosition = v3(random(-100, 100), -random(200, 300));

        if (isMainPlayer) {
            node.children[0].active = true;
            const spine = node.children[0].getComponent(sp.Skeleton);

            const animationDuration = spine.findAnimation("animation").duration;
            tween(node)
                .parallel(
                    tween(node).call(async () => {
                        spine && AnimationUtils.playSpine(spine, "animation");
                    }),
                    tween(node).to(animationDuration, {
                        position: randomPosition,
                        scale: v3(1, 1).multiplyScalar(0.5),
                    }),

                    tween(node).delay(animationDuration).destroySelf()
                )
                .start();
        } else {
            const duration = 2;
            const fadeDuration = 0.3;
            node.angle = 90;
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
        }

        return node;
    }
}
