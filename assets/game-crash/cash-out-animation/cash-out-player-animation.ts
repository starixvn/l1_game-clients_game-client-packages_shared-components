import gc from "@sg/game-client-base";
import { Color, Label, Node, UITransform, _decorator, sp, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { NodeContainer } from "../../shared/common-components/node-container/node-container";
import { AnimationUtils, ComponentUtils } from "../../shared/utils";
const { render } = Observer;
const { ccclass, property } = _decorator;
const { GameCrash, FormatUtils } = gc;

export const CashOutAnim = {
    mainPlayer: "main",
    otherPlayer: "user",
};

export const ColorWinValue = {
    mainPlayer: "ECB90A",
    otherPlayer: "4d7fb6",
};

enum PathBonesIndex {
    main = 0,
    player = 1,
}

@ccclass
export class CashOutPlayerAnimation extends NodeContainer {
    @property(Node)
    containerSpaceman: Node = null;

    @render(GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    async renderOtherPlayerCashOut(otherPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (otherPlayer) {
            const player = otherPlayer?.cashOut || otherPlayer?.halfCashOut;
            const winAmount = player?.win || 0;
            await this.createCashOutPlayer(winAmount);
        }
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOut, { fireImmediately: false })
    renderMainPlayerCashOutFull(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        cashOut && this.createCashOutMainPlayer(cashOut);
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.halfCashOut, { fireImmediately: false })
    renderMainPlayerCashOutHalf(halfCashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        halfCashOut && this.createCashOutMainPlayer(halfCashOut);
    }

    async createCashOutMainPlayer(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        await this.createCashOutPlayer(cashOut?.win || 0, true);
    }

    private async createCashOutPlayer(winValue: number, isMainPlayer = false) {
        const node = this.createNode();
        const currentPosition = this.containerSpaceman
            .getComponent(UITransform)
            .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
        const randomPosition = v3(currentPosition.x + random(-200, 100), -random(20, 50));
        ComponentUtils.moveToOtherNode(node, this.containerSpaceman);
        if (node?.children[0]) {
            const animationName = isMainPlayer ? CashOutAnim.mainPlayer : CashOutAnim.otherPlayer;
            const spine = node?.getComponentInChildren(sp.Skeleton);
            const animationDuration = spine?.findAnimation(animationName).duration;
            const lblWin = spine.node?.getComponentInChildren(Label);
            if (lblWin) {
                lblWin.string = FormatUtils.numberWithCommas(winValue, 2);
                lblWin.color = new Color().fromHEX(isMainPlayer ? ColorWinValue.mainPlayer : ColorWinValue.otherPlayer);
            }
            tween(node)
                .parallel(
                    tween(node).call(async () => {
                        spine && AnimationUtils.playSpine(spine, animationName);
                    }),
                    tween(node).to(animationDuration, {
                        position: randomPosition,
                        scale: v3(1, 1, 1).multiplyScalar(0.5),
                    }),
                    tween(node).delay(animationDuration).destroySelf()
                )
                .start();
        }

        return node;
    }
}
