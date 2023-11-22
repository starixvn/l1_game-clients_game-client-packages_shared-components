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

    @property
    collapsedBoardHeight = 100;

    @property
    expandedBoardHeight = 310;

    private readonly itemHeight = 30;
    private otherPlayerList: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer[] = [];
    private otherPlayerTween: Tween<Widget> = null;
    private leaderBoardTween: Tween<UITransform> = null;
    private isExpandedBoard = true;

    onLoad() {
        this.resetOtherPlayers();
        this.resetMainPlayer();
        super.onLoad();
    }

    @handle(GameCrash.CrashBetList.CrashBetListHandlers, (handler) => handler.resetOtherPlayerList())
    private resetOtherPlayers() {
        this.scrollOtherPlayer(0);
        this.otherPlayerList = [];
        this.nodeContent.removeAllChildren();
        this.otherPlayersScrollView.scrollToTop(0.1);
    }

    @handle(GameCrash.CrashBetList.CrashBetListHandlers, (handler) => handler.resetMainPlayer())
    private resetMainPlayer() {
        this.setMainPlayerVisibility(false);
        this.cpnMainPlayer.setHalfCashOutVisibility(false);
    }

    @render(GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    private updateOtherPlayerCashout(otherPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, cashOut, halfCashOut } = otherPlayer;
        const player = this.otherPlayerList.find((player) => player.playerId === playerId);
        if (!player) {
            return;
        }
        halfCashOut && (player["halfCashOut"] = halfCashOut);
        cashOut && (player["cashOut"] = cashOut);
        const playerNode = this.nodeContent.getChildByName(otherPlayer.playerId);
        if (playerNode) {
            const comp = playerNode.getComponent(LeaderBoardItem);
            comp?.setData(player);
        }
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.betList, { fireImmediately: false })
    updateOtherPlayers(betList: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayerList) {
        const { players } = betList;

        if (players.length === 0) {
            return;
        }

        this.otherPlayerList = players;
        const itemList = this.nodeContent.getComponentsInChildren(LeaderBoardItem);

        if (itemList.length === 0) {
            players.forEach((player) => {
                this.createBoardItem(player.playerId);
            });
        } else {
            this.createBoardItem();
        }

        this.nodeContent.getComponentsInChildren(LeaderBoardItem).forEach((item, index) => {
            const playerData = players[index];
            if (!playerData) {
                item.destroy();
                return;
            }

            item.setData(playerData);
            item.node.name = playerData.playerId;
        });
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => store.mainPlayer, { fireImmediately: false })
    updateMainPlayer(mainPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { amount, halfCashOut, cashOut } = mainPlayer;

        if (amount) {
            this.setMainPlayerVisibility(true);
            this.cpnMainPlayer?.setData(mainPlayer, true);
            this.scrollOtherPlayer(this.itemHeight);

            if (halfCashOut && cashOut) {
                this.cpnMainPlayer.nodeHalfCashOutContainer.active = true;
                this.scrollOtherPlayer(this.itemHeight * 2);
                !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight + this.itemHeight);
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.startPlacingBet)
    private resetLeaderBoard(startPlacingBet: boolean) {
        if (startPlacingBet) {
            this.resetMainPlayer();
            this.resetOtherPlayers();
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isTimeOut)
    private setBetAmountEmpty(isTimeOut: boolean) {
        if (isTimeOut) {
            this.nodeContent.children.forEach((playerNode) => {
                const comp = playerNode.getComponent(LeaderBoardItem);
                comp.setCashOutEmpty();
            });
            this.cpnMainPlayer.setCashOutEmpty();
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
        const collapseHeight = this.cpnMainPlayer.isShowHalfCashOutContainerNode()
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

    private createBoardItem(playerId = ""): Node {
        const node = instantiate(this.pfbItem);
        node.name = playerId;
        this.nodeContent.addChild(node);
        return node;
    }

    private setMainPlayerVisibility(isShow: boolean) {
        this.cpnMainPlayer.node.active = isShow;
    }
}
