import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, ScrollView, Tween, tween, UITransform, v3, Widget } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { LeaderBoardItem } from "./leader-board-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, Rounds } = gc;

@ccclass
export class LeaderBoard extends ObserverComponent {
    @property(ScrollView)
    otherPlayersScrollView: ScrollView = null;

    @property(Node)
    nodeContent: Node = null;

    @property(Node)
    nodeOtherPLayerContainer: Node = null;

    @property(LeaderBoardItem)
    cpnMainPlayer: LeaderBoardItem = null;

    @property(Prefab)
    pfbItem: Prefab = null;

    @property(Node)
    nodeArrowIcon: Node = null;

    @property(Node)
    nodeLeaderBoardMask: Node = null;

    private readonly collapsedBoardHeight = 45;
    private readonly expandedBoardHeight = 187;
    private readonly itemHeight = 27;
    private otherPlayerTween: Tween<Widget> = null;
    private leaderBoardTween: Tween<UITransform> = null;
    private isExpandedBoard = true;

    onLoad() {
        this.resetOtherPlayers();
        this.hideMainPlayer();
        super.onLoad();
    }

    private resetOtherPlayers() {
        this.scrollOtherPlayer(0);
        this.nodeContent.removeAllChildren();
        this.otherPlayersScrollView.scrollToTop(0.1);
    }

    private hideMainPlayer() {
        this.setMainPlayerDisplay(false);
        this.cpnMainPlayer.setHalfCashOutDisplay(false);
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.betList, {
        fireImmediately: false,
    })
    private updateOtherPlayers(betList: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayerList) {
        const { players } = betList;

        if (players.length === 0) {
            return;
        }

        players.forEach((player, index) => {
            let node = this.nodeContent.children[index];

            if (!node) {
                node = this.createBoardItem();
            }
            const comp = node.getComponent(LeaderBoardItem);
            comp?.setData(player);
        });
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.mainPlayer, {
        fireImmediately: false,
    })
    private updateMainPlayer(mainPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        if (!mainPlayer) {
            return;
        }
        const { halfCashOut, cashOut } = mainPlayer;

        this.setMainPlayerDisplay(true);
        this.cpnMainPlayer?.setData(mainPlayer);
        this.scrollOtherPlayer(this.itemHeight);

        if (halfCashOut && cashOut) {
            this.scrollOtherPlayer(this.itemHeight * 2);
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight + this.itemHeight);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    private resetLeaderBoard(isStartPlacingBet: boolean) {
        if (isStartPlacingBet) {
            this.hideMainPlayer();
            this.resetOtherPlayers();
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight);
        }
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        const otherPlayerWidget = this.nodeOtherPLayerContainer.getComponent(Widget);
        if (isAnimated) {
            this.otherPlayerTween?.stop();
            const contentWidget = this.nodeContent.getComponent(Widget);
            this.otherPlayerTween = tween(otherPlayerWidget)
                .to(
                    0.2,
                    { editorTop: top },
                    {
                        onUpdate() {
                            contentWidget.updateAlignment();
                        },
                    }
                )
                .start();
        } else {
            otherPlayerWidget.editorTop = top;
        }
    }

    onClickCollapseButton(e) {
        this.playSoundClick();
        const collapseHeight = this.cpnMainPlayer.isShowFullCashOutNode()
            ? this.collapsedBoardHeight + this.itemHeight
            : this.collapsedBoardHeight;
        const boardHeight = this.isExpandedBoard ? collapseHeight : this.expandedBoardHeight;
        this.collapseAndExpandBoard(boardHeight);
        this.nodeArrowIcon.eulerAngles = this.isExpandedBoard ? v3(0, 0, 180) : v3(0, 0, 0);
        this.isExpandedBoard = !this.isExpandedBoard;
    }

    private collapseAndExpandBoard(boardHeight: number) {
        const leaderBoardSize = this.node.getComponent(UITransform);
        const leaderBoardMaskWidget = this.nodeLeaderBoardMask.getComponent(Widget);
        const arrowIconWidget = this.nodeArrowIcon.parent.getComponent(Widget);
        const scrollView = this.nodeOtherPLayerContainer.parent.getComponent(ScrollView);

        this.leaderBoardTween?.stop();
        this.leaderBoardTween = tween(leaderBoardSize)
            .to(
                0.3,
                { height: boardHeight },
                {
                    onUpdate() {
                        arrowIconWidget.updateAlignment();
                        leaderBoardMaskWidget.updateAlignment();
                    },
                }
            )
            .call(() => {
                scrollView.enabled = this.isExpandedBoard;
            })
            .start();
    }

    private createBoardItem(): Node {
        const node = instantiate(this.pfbItem);
        this.nodeContent.addChild(node);
        return node;
    }

    private setMainPlayerDisplay(isShow: boolean) {
        this.cpnMainPlayer.node.active = isShow;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
