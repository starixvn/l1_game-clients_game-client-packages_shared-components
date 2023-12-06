import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, ScrollView, Tween, tween, UITransform, v3, Widget } from "cc";
import Observer from "observer";

import { settings } from "../../../../../../../assets/game/scripts/game-settings";
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

    private readonly collapsedBoardHeight = 61;
    private readonly expandedBoardHeight = 210;
    private readonly itemHeight = 30;
    private otherPlayerTween: Tween<Widget> = null;
    private leaderBoardTween: Tween<UITransform> = null;
    private isExpandedBoard = true;

    onLoad() {
        this.resetOtherPlayers();
        this.resetMainPlayer();
        super.onLoad();
    }

    @handle(GameCrash.CrashBetList.CrashBetListHandlers, (handler) => handler.resetOtherPlayerList())
    handleResetOtherPlayers() {
        this.resetOtherPlayers();
    }

    private resetOtherPlayers() {
        this.scrollOtherPlayer(0);
        this.nodeContent.removeAllChildren();
        this.otherPlayersScrollView.scrollToTop(0.1);
    }

    @handle(GameCrash.CrashBetList.CrashBetListHandlers, (handler) => handler.resetMainPlayer())
    private resetMainPlayer() {
        this.hideMainPlayer();
    }

    private hideMainPlayer() {
        this.setMainPlayerVisibility(false);
        this.cpnMainPlayer.setHalfCashOutVisibility(false);
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => ({ betList: store.betList, roundTime: store.roundTime }), {
        fireImmediately: false,
    })
    private updateOtherPlayers({ betList, roundTime }) {
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
            comp?.setData(player, false, this.checkNeedEmptyBetAmount(roundTime));
        });
    }

    @render(GameCrash.CrashBetList.CrashBetListStore, (store) => ({ mainPlayer: store.mainPlayer, roundTime: store.roundTime }), {
        fireImmediately: false,
    })
    private updateMainPlayer({ mainPlayer, roundTime }) {
        const { amount, halfCashOut, cashOut } = mainPlayer;

        if (amount) {
            this.setMainPlayerVisibility(true);
            this.cpnMainPlayer?.setData(mainPlayer, true, this.checkNeedEmptyBetAmount(roundTime));
            this.scrollOtherPlayer(this.itemHeight);

            if (halfCashOut && cashOut) {
                this.scrollOtherPlayer(this.itemHeight * 2);
                !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight + this.itemHeight);
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.startPlacingBet)
    private resetLeaderBoard(startPlacingBet: boolean) {
        if (startPlacingBet) {
            this.hideMainPlayer();
            this.handleResetOtherPlayers();
            this.resetMainPlayer();
            !this.isExpandedBoard && this.collapseAndExpandBoard(this.collapsedBoardHeight);
        }
    }

    private checkNeedEmptyBetAmount(roundTime): boolean {
        return roundTime <= 0 || (roundTime <= settings.durations.wholeRound && roundTime > settings.durations.placingBet);
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

    private setMainPlayerVisibility(isShow: boolean) {
        this.cpnMainPlayer.node.active = isShow;
    }
}
