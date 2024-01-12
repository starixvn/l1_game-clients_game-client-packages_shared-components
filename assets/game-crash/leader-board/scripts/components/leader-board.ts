import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, Tween, tween, UITransform, Widget } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { LeaderBoardCashOut } from "./leader-board-cash-out";
import { LeaderBoardMainPlayer } from "./leader-board-main-player";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, Rounds } = gc;

@ccclass
export class LeaderBoard extends ObserverComponent {
    @property(Node)
    nodeOtherPlayers: Node = null;

    @property(LeaderBoardMainPlayer)
    cpnMainPlayer: LeaderBoardMainPlayer = null;

    @property(Prefab)
    pfbItem: Prefab = null;

    @property(Node)
    nodeLeaderBoardMask: Node = null;

    private readonly itemHeight = 24;
    private otherPlayerTween: Tween<Widget> = null;

    onLoad() {
        this.resetOtherPlayers();
        this.setMainPlayerDisplay(false);
        super.onLoad();
    }

    private resetOtherPlayers() {
        this.nodeOtherPlayers.destroyAllChildren();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.betList)
    private updateOtherPlayers(betList: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayerList) {
        const { players } = betList;

        if (players.length === 0) {
            this.resetOtherPlayers();
            return;
        }

        players.forEach((player, index) => {
            let node = this.nodeOtherPlayers.children[index];
            const { name, amount, halfCashOut, cashOut } = player;
            const calcAmount = halfCashOut?.amount || cashOut?.amount || amount;
            const multiplier = halfCashOut?.multiplier || cashOut?.multiplier;
            const win = halfCashOut?.win || cashOut?.win;

            if (!node) {
                node = this.createBoardItem();
            }
            const comp = node.getComponent(LeaderBoardCashOut);
            comp?.setData({
                name,
                amount: calcAmount,
                multiplier,
                win,
            });
        });
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.mainPlayer)
    private updateMainPlayer(mainPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (!mainPlayer) {
            this.setMainPlayerDisplay(false);
            this.scrollOtherPlayer(0);
            return;
        }
        const { halfCashOut } = mainPlayer;

        this.setMainPlayerDisplay(true);
        this.cpnMainPlayer?.setData(mainPlayer);
        this.scrollOtherPlayer(halfCashOut ? this.itemHeight * 2 : this.itemHeight);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    private resetOtherPlayerScroll(isStartPlacingBet: boolean) {
        if (isStartPlacingBet) {
            this.scrollOtherPlayer(0);
        }
    }

    updateContentHeight(top: number) {
        const otherPlayerTransform = this.nodeOtherPlayers.getComponent(UITransform);
        const content = this.nodeOtherPlayers.parent.getComponent(UITransform);
        content.height = top + otherPlayerTransform.height;
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        const otherPlayerWidget = this.nodeOtherPlayers.getComponent(Widget);

        if (isAnimated) {
            this.otherPlayerTween?.stop();
            this.otherPlayerTween = tween(otherPlayerWidget)
                .to(
                    0.2,
                    { editorTop: top },
                    {
                        onUpdate() {
                            otherPlayerWidget.updateAlignment();
                        },
                    }
                )
                .call(() => this.updateContentHeight(top))
                .start();
        } else {
            otherPlayerWidget.editorTop = top;
            this.updateContentHeight(top);
        }
    }

    private createBoardItem(): Node {
        const node = instantiate(this.pfbItem);
        this.nodeOtherPlayers.addChild(node);
        return node;
    }

    private setMainPlayerDisplay(isShow: boolean) {
        this.cpnMainPlayer.node.active = isShow;
    }
}
