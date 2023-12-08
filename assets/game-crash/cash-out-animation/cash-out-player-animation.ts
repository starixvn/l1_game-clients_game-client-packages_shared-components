import gc from "@sg/game-client-base";
import { _decorator, sp, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { NodeContainer } from "../../shared/common-components/node-container/node-container";
import { AnimationUtils } from "../../shared/utils";
const { render } = Observer;
const { ccclass } = _decorator;
const { GameCrash } = gc;

export const CashOutAnim = {
    mainPlayer: "main",
    otherPlayer: "user",
};

@ccclass
export class CashOutPlayerAnimation extends NodeContainer {
    @render(GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    async renderOtherPlayerCashOut() {
        await this.createCashOutPlayer(false);
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
        await this.createCashOutPlayer(true);
    }

    private async createCashOutPlayer(isMainPlayer = false) {
        const node = this.createNode();
        const randomPosition = v3(random(-100, 100), -random(200, 300));
        const animationName = isMainPlayer ? CashOutAnim.mainPlayer : CashOutAnim.otherPlayer;
        if (node?.children[0]) {
            const spine = node.children[0]?.getComponent(sp.Skeleton);
            const animationDuration = spine?.findAnimation(animationName).duration;
            tween(node)
                .parallel(
                    tween(node).call(async () => {
                        spine && AnimationUtils.playSpine(spine, animationName);
                    }),
                    tween(node).to(animationDuration, {
                        position: randomPosition,
                        scale: v3(1, 1).multiplyScalar(0.5),
                    }),
                    tween(node).delay(animationDuration).destroySelf()
                )
                .start();
        }

        return node;
    }
}
