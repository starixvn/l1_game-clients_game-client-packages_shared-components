import { Component, Game, Label, _decorator, game } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { InGameMenuEvents } from "../../../in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "../../../in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "../../../node-container/node-container";
import WebViewGuide from "../../game-guide/scripts/web-view-guide";

const { Rounds, Connection, HideGame, JoinGame, Settlements, FormatUtils, RoundHistories } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class GameComponent extends Component {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblMinBet: Label = null;

    @property(Label)
    lblMaxBet: Label = null;

    @property(NodeContainer)
    guideContainer: NodeContainer = null;

    @property(NodeContainer)
    md5Container: NodeContainer = null;

    protected roundId = 0;

    protected onLoad(): void {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onJoinGame, this);

        this.initMd5Container();
        
    }

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onJoinGame, this);
    }

    initMd5Container(){
        if(this.md5Container){
            this.md5Container.createNode();            
        }
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {}

    @handle(JoinGame.JoinGameHandler)
    onJoinGame() {}

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomShowResult)
    handleJoinGameAndShowResult(joinRoomShowResult: gc.RoundHistories.IJoinRoomShowResult) {
        const { isShowResult, roundHistory } = joinRoomShowResult;
        if (isShowResult) {
            this.roundId = roundHistory?.roundId;
            this.setRoundId();
            this.showResult(roundHistory?.result, false);
        }
    }
    @render(RoundHistories.RoundHistoryStore, (store) => store.isResetResultJoinRoom)
    handleResetResultWhenJoinRoom(isResetResultJoinRoom: boolean) {
        isResetResultJoinRoom && this.resetAnimationResult();
    }

    resetAnimationResult() {}

    @render(Rounds.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @handle(Rounds.RoundUIHandlers.SetRoundId)
    setRoundId() {
        return this.roundId;
    }

    @render(Settlements.SettlementStore, (store) => ({ roundId: store.roundId, result: store.result }))
    handleResult({ roundId, result }: { roundId: number; result: gc.GameServiceMessage.TResult }) {
        roundId && (this.roundId = roundId);
        this.showResult(result, true);
    }

    showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {}

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult() {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartGenerateResult)
    startGenerateResult(isStartGenerateResult: boolean) {
        if (isStartGenerateResult) {
            this.finishedSettlement();
            this.resetForNewRound();
            this.roundId++;
            this.setRoundId();
        }
    }

    @handle(Settlements.SettlementUIHandlers.FinishedSettlement)
    finishedSettlement() {}

    @handle(Rounds.RoundUIHandlers.ResetRoundStore)
    resetForNewRound() {}

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openGuide({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_GUIDE) {
            const guide = this.guideContainer.createNode();
            guide.getComponent(WebViewGuide)?.initUrl();
        }
    }
}
