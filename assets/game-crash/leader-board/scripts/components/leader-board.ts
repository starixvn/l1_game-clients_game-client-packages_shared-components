import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, Tween, tween, Widget } from "cc";
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

    @property(Node)
    nodeOtherPLayerContainer: Node = null;

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
        this.nodeOtherPlayers.removeAllChildren();
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.betList, {
        fireImmediately: false,
    })
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

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.mainPlayer, {
        fireImmediately: false,
    })
    private updateMainPlayer(mainPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (!mainPlayer) {
            this.setMainPlayerDisplay(false);
            return;
        }
        const { halfCashOut, cashOut } = mainPlayer;

        this.setMainPlayerDisplay(true);
        this.cpnMainPlayer?.setData(mainPlayer);
        this.scrollOtherPlayer(this.itemHeight);

        if ((halfCashOut && !cashOut) || (halfCashOut && cashOut)) {
            this.scrollOtherPlayer(this.itemHeight * 2);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    private resetOtherPlayerScroll(isPlacingBet: boolean) {
        if (isPlacingBet) {
            console.log("resetOtherPlayerScroll");
            this.scrollOtherPlayer(0);
        }
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        const otherPlayerWidget = this.nodeOtherPLayerContainer.getComponent(Widget);
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
                .start();
        } else {
            otherPlayerWidget.editorTop = top;
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
