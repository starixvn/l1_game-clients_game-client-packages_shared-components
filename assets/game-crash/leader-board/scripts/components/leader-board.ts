import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, UITransform, v3 } from "cc";
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

    @property(LeaderBoardItem)
    cpnMainPlayer: LeaderBoardItem = null;

    @property(Prefab)
    pfbItem: Prefab = null;

    @property(Node)
    nodeOtherPlayerContainer: Node = null;

    private readonly itemHeight = 30;
    private otherPlayerPos = v3(0, 0, 0);
    private playerList: ILeaderBoardItemData[] = [];
    private mainPlayer: ILeaderBoardItemData = {
        playerId: "",
        name: "",
        betAmount: null,
    };

    onLoad() {
        super.onLoad();
        this.reset();
        this.otherPlayerPos = this.nodeOtherPlayerContainer.position;
    }

    reset() {
        this.playerList = [];
        this.cpnMainPlayer.node.active = false;
        this.nodeContent.removeAllChildren();
    }

    @render(gc.GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    updateOtherPlayerCashout(otherPlayer) {
        const data: ILeaderBoardItemData = {
            playerId: otherPlayer.playerId,
            name: otherPlayer.name,
            cashOut: {
                win: otherPlayer.cashOut.win,
                multiplier: otherPlayer.cashOut.multiplier,
            },
        };

        const playerNode = this.nodeContent.getChildByName(otherPlayer.playerId);
        const comp = playerNode.getComponent(LeaderBoardItem);
        comp?.setData(data);
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOut, { fireImmediately: false })
    updateMainPlayerCashout(cashOut) {
        this.mainPlayer.cashOut = cashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
        if (this.mainPlayer.halfCashOut) {
            let pos = this.nodeOtherPlayerContainer.position;
            pos = v3(pos.x, pos.y - this.itemHeight, pos.z);
            const size = this.nodeOtherPlayerContainer.getComponent(UITransform);
            size.height = size.height - this.itemHeight;
        }
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.halfCashOut, { fireImmediately: false })
    updateMainPlayerHalfCashout(halfCashOut) {
        this.mainPlayer.halfCashOut = halfCashOut;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
    }

    createLeaderBoardItem(data: ILeaderBoardItemData) {
        const node = instantiate(this.pfbItem);
        node.name = data.playerId;
        this.nodeContent.addChild(node);
        const compleaderBoardItem = node.getComponent(LeaderBoardItem);
        compleaderBoardItem?.setData(data);
    }

    @render(gc.Chips.ChipStore, (store) => store.playerChip, { fireImmediately: false })
    addOtherPlayerPlacingBet(playerChip) {
        const data: ILeaderBoardItemData = {
            playerId: playerChip.playerId,
            name: playerChip.name,
            betAmount: playerChip.amount,
        };

        this.playerList.push(data);
        this.playerList.sort((a, b) => b.betAmount - a.betAmount);
        this.nodeContent.removeAllChildren();
        this.playerList.forEach((data) => {
            this.createLeaderBoardItem(data);
        });
    }

    @render(gc.Player.MainPlayerStore, (store) => store.name)
    updateMainPlayerName(name: string) {
        this.mainPlayer["name"] = name;
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    showMainPlayer(lastReceivedBet) {
        this.mainPlayer["betAmount"] = lastReceivedBet.value;
        this.cpnMainPlayer.node.active = true;
        this.cpnMainPlayer?.setData(this.mainPlayer, true);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    resetLeaderBoard(status: boolean) {
        if (status) {
            this.mainPlayer["betAmount"] = null;
            this.reset();
            this.nodeOtherPlayerContainer.position = this.otherPlayerPos;
        }
    }
}
