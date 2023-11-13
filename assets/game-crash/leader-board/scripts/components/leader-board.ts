import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, Tween, tween, v3, Widget } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { ILeaderBoardItemData } from "../leader-board-data";
import { LeaderBoardItem } from "./leader-board-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class LeaderBoard extends ObserverComponent {
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

    private readonly itemHeight = 30;
    private readonly defaultOtherPlayerPos = v3(0, 136, 0);
    private otherPlayerList: ILeaderBoardItemData[] = [];
    private mainPlayer: ILeaderBoardItemData = {
        playerId: "",
        name: "",
        betAmount: null,
    };
    private otherPlayerTween: Tween<Widget> = null;
    private otherPlayerWidget: Widget = null;
    private isEpandedBoard = true;

    onLoad() {
        super.onLoad();
        this.otherPlayerWidget = this.nodeOtherPLayerContainer.getComponent(Widget);
        this.resetOtherPlayer();
    }

    private resetOtherPlayer() {
        this.otherPlayerList = [];
        this.nodeContent.removeAllChildren();

        if (!this.cpnMainPlayer) {
            return;
        }
        this.cpnMainPlayer.node.active = false;
        this.cpnMainPlayer.nodeCashOutContainer.active = true;
    }

    @render(gc.GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    private updateOtherPlayerCashout(otherPlayer) {
        const { playerId, name, cashOut, halfCashOut } = otherPlayer;
        const data: ILeaderBoardItemData = {
            playerId: playerId,
            name: this.convertEncryptedName(name),
            cashOut: cashOut ?? null,
            halfCashOut: halfCashOut ?? null,
        };

        const playerNode = this.nodeContent.getChildByName(otherPlayer.playerId);
        if (playerNode) {
            const comp = playerNode?.getComponent(LeaderBoardItem);
            comp?.setData(data);
        } else {
            this.createLeaderBoardItem(data);
        }
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOut, { fireImmediately: false })
    private updateMainPlayerCashout(cashOut) {
        this.mainPlayer.cashOut = cashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
        if (this.mainPlayer.halfCashOut) {
            this.cpnMainPlayer.nodeCashOutContainer.active = true;
            this.scrollOtherPlayer(this.itemHeight * 2);
        }
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.halfCashOut, { fireImmediately: false })
    private updateMainPlayerHalfCashout(halfCashOut) {
        this.mainPlayer.halfCashOut = halfCashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
    }

    private createLeaderBoardItem(data: ILeaderBoardItemData) {
        const node = instantiate(this.pfbItem);
        node.name = data.playerId;
        this.nodeContent.addChild(node);
        const compleaderBoardItem = node.getComponent(LeaderBoardItem);
        compleaderBoardItem?.setData(data);
    }

    @render(gc.Chips.ChipStore, (store) => store.playerChip, { fireImmediately: false })
    private addOtherPlayerPlacingBet(playerChip) {
        const { playerId, name, amount } = playerChip;
        const data: ILeaderBoardItemData = {
            playerId: playerId,
            name: this.convertEncryptedName(name),
            betAmount: amount,
        };

        this.otherPlayerList.push(data);
        this.otherPlayerList.sort((a, b) => b.betAmount - a.betAmount);
        this.nodeContent.removeAllChildren();
        this.otherPlayerList.forEach((data) => {
            this.createLeaderBoardItem(data);
        });
    }

    @render(gc.Player.MainPlayerStore, (store) => store.name)
    private updateMainPlayerName(name: string) {
        this.mainPlayer["name"] = name;
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    private showMainPlayer(lastReceivedBet) {
        if (lastReceivedBet.value === -1) {
            return;
        }
        this.mainPlayer.betAmount = lastReceivedBet.value;
        this.cpnMainPlayer.node.active = true;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
        this.scrollOtherPlayer(this.itemHeight);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.startPlacingBet)
    private resetLeaderBoard(startPlacingBet: boolean) {
        if (startPlacingBet) {
            this.scrollOtherPlayer(0);
            this.mainPlayer.betAmount = null;
            this.resetOtherPlayer();
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

    private convertEncryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }

    private scrollOtherPlayer(top: number, isAnimated = true) {
        if (isAnimated) {
            this.otherPlayerTween?.stop();
            this.otherPlayerTween = tween(this.otherPlayerWidget)
                .to(0.2, { editorTop: top }, { easing: "sineOut" })
                .call(() => {
                    this.nodeContent.getComponent(Widget).updateAlignment();
                })
                .start();
        } else {
            this.otherPlayerWidget.editorTop = top;
        }
    }

    onClickCollapseButton(e) {
        if (this.isEpandedBoard) {
            this.isEpandedBoard = false;
        } else {
            this.isEpandedBoard = true;
        }
    }
}
