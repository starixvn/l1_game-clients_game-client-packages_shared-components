import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, ScrollView, Tween, tween, UITransform, v3, Widget } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { LeaderBoardHandler } from "../handlers/leader-board-handlers";
import { ILeaderBoardItemData } from "../leader-board-data";
import { LeaderBoardStore } from "../stores/leader-board-store";
import { LeaderBoardItem } from "./leader-board-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

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
    private otherPlayerList: ILeaderBoardItemData[] = [];
    private mainPlayer: ILeaderBoardItemData = {
        playerId: "",
        name: "",
        betAmount: null,
        cashOut: null,
        halfCashOut: null,
    };
    private otherPlayerTween: Tween<Widget> = null;
    private otherPlayerWidget: Widget = null;
    private isExpandedBoard = true;

    onLoad() {
        super.onLoad();
        this.otherPlayerWidget = this.nodeOtherPLayerContainer.getComponent(Widget);
        this.resetMainPlayer();
        this.resetOtherPlayers();
    }

    private resetOtherPlayers() {
        this.scrollOtherPlayer(0);
        this.otherPlayerList = [];
        this.nodeContent.removeAllChildren();
        this.otherPlayersScrollView.scrollToTop(0.1);
    }

    @render(gc.GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    private updateOtherPlayerCashout(otherPlayer) {
        const { playerId, name, cashOut, halfCashOut } = otherPlayer;
        const player = this.otherPlayerList.find((player) => player.playerId === playerId);
        halfCashOut && (player.halfCashOut = halfCashOut);
        cashOut && (player.cashOut = cashOut);
        player.name = this.encryptedName(name);

        const playerNode = this.nodeContent.getChildByName(otherPlayer.playerId);
        if (playerNode) {
            const comp = playerNode?.getComponent(LeaderBoardItem);
            comp?.setData(player);
        } else {
            const node = this.createBoardItem(playerId);
            const compleaderBoardItem = node.getComponent(LeaderBoardItem);
            compleaderBoardItem?.setData(player);
        }
    }

    private createBoardItem(playerId: string): Node {
        const node = instantiate(this.pfbItem);
        node.name = playerId;
        this.nodeContent.addChild(node);
        return node;
    }

    @render(gc.Chips.ChipStore, (store) => store.playerChip, { fireImmediately: false })
    private addOtherPlayerPlacingBet(playerChip) {
        const { playerId, name, amount } = playerChip;

        this.createBoardItem(playerId);

        const data: ILeaderBoardItemData = {
            playerId: playerId,
            name: this.encryptedName(name),
            betAmount: amount,
        };

        this.otherPlayerList.push(data);
        this.otherPlayerList.sort((a, b) => b.betAmount - a.betAmount);

        this.nodeContent.getComponentsInChildren(LeaderBoardItem).forEach((item, index) => {
            const playerData = this.otherPlayerList[index];
            item.setData(playerData);
            item.node.name = playerData.playerId;
        });
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOut, { fireImmediately: false })
    private updateMainPlayerCashout(cashOut) {
        this.mainPlayer.cashOut = cashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
        if (this.mainPlayer.halfCashOut) {
            this.cpnMainPlayer.nodeCashOutContainer.active = true;
            this.scrollOtherPlayer(this.itemHeight * 2);
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight + this.itemHeight);
        }
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.halfCashOut, { fireImmediately: false })
    private updateMainPlayerHalfCashout(halfCashOut) {
        this.mainPlayer.halfCashOut = halfCashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
    }

    @handle(LeaderBoardHandler, (handler) => handler.showMainPlayerInfo())
    private showMainPlayerInfo() {}

    @handle(LeaderBoardHandler, (handler) => handler.resetMainPlayer())
    private resetMainPlayer() {}

    @render(LeaderBoardStore, (store) => store.isShowMainPlayerInfo)
    setMainPlayerVisibility(isShowMainPlayerInfo: boolean) {
        this.cpnMainPlayer.node.active = isShowMainPlayerInfo;
    }

    @render(LeaderBoardStore, (store) => store.mainPlayer, { fireImmediately: false })
    updateMainPlayer(mainPlayer: ILeaderBoardItemData) {
        const { betAmount, halfCashOut, cashOut } = mainPlayer;

        betAmount && this.showMainPlayerInfo();
        this.cpnMainPlayer?.setData(mainPlayer, true);
        this.scrollOtherPlayer(this.itemHeight);

        if (halfCashOut && cashOut) {
            this.cpnMainPlayer.nodeCashOutContainer.active = true;
            this.scrollOtherPlayer(this.itemHeight * 2);
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight + this.itemHeight);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.startPlacingBet)
    private resetLeaderBoard(startPlacingBet: boolean) {
        if (startPlacingBet) {
            this.resetMainPlayer();
            this.resetOtherPlayers();
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isTimeOut)
    private setBetAmountEmpty(isTimeOut: boolean) {
        if (isTimeOut) {
            this.nodeContent.children.forEach((playerNode) => {
                const comp = playerNode.getComponent(LeaderBoardItem);
                comp.setCashOutEmpty();
            });
            this.cpnMainPlayer.setCashOutEmpty();
        }
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        if (isAnimated) {
            this.otherPlayerTween?.stop();
            const contentWidget = this.nodeContent.getComponent(Widget);
            this.otherPlayerTween = tween(this.otherPlayerWidget)
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
            this.otherPlayerWidget.editorTop = top;
        }
    }

    onClickCollapseButton(e) {
        const boardHeight = this.isExpandedBoard ? this.collapsedBoardHeight : this.expandedBoardHeight;
        this.collapseAndExpandBoard(boardHeight);
        this.nodeArrowIcon.eulerAngles = this.isExpandedBoard ? v3(0, 0, 180) : v3(0, 0, 0);
        this.isExpandedBoard = !this.isExpandedBoard;
    }

    private collapseAndExpandBoard(boardHeight: number) {
        const leaderBoardSize = this.node.getComponent(UITransform);
        const leaderBoardMaskWidget = this.nodeLeaderBoardMask.getComponent(Widget);
        const arrowIconWidget = this.nodeArrowIcon.parent.getComponent(Widget);
        const scrollView = this.nodeOtherPLayerContainer.parent.getComponent(ScrollView);

        tween(leaderBoardSize)
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
}
