import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, SpriteAtlas } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameCrash } = gc;

@ccclass
export class RoundHistoryItem extends ObserverComponent {
    @property(Node)
    nodeCountdown: Node = null;

    @property(Label)
    lblCountdown: Label = null;

    @property(Sprite)
    nodeMultiplier: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Node)
    nodeInPlay: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    public isLastRound = false;

    public roundInfo: gc.RoundHistories.RoundHistory = null;
    readonly START_BET_TIMER = 10;
    readonly END_BET_TIMER = 0;

    displayMultiplier(show: boolean) {
        this.nodeMultiplier.node.active = show;
    }

    displayCountDown(show: boolean) {
        this.nodeCountdown.active = show;
    }

    displayInPlay(show: boolean) {
        this.nodeInPlay.active = show;
    }

    hideAllNodes() {
        this.displayMultiplier(false);
        this.displayCountDown(false);
        this.displayInPlay(false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundTime)
    updateCountDownValue(roundTime: number) {
        if (roundTime <= this.START_BET_TIMER && roundTime > this.END_BET_TIMER) {
            if (!this.isCrashed()) {
                this.lblCountdown.string = roundTime.toString();
                this.hideAllNodes();
                this.displayCountDown(true);
            }
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundTime)
    showInPlayStatus(roundTime: number) {
        if (roundTime === 0 && !this.isCrashed()) {
            this.hideAllNodes();
            this.displayInPlay(true);
        }
    }

    updateMultiplierValue(value: number, name: string) {
        this.hideAllNodes();
        this.displayMultiplier(true);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
        this.setSpriteFrameBg(value, this.nodeMultiplier, this.mainAtlas, name);
    }

    isCrashed() {
        return !!this?.roundInfo?.pf?.result;
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, roundId: number) => handle.openVerificationLatestRound(roundId))
    onClickRoundItem() {
        this.playSoundClick();
        return this.roundInfo.roundId;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    private setSpriteFrameBg(multiplier: number, nodeBg: Sprite, mainAtlas: SpriteAtlas, name: string) {
        let sufix = "";
        if (multiplier <= 5) {
            sufix = "blue";
        } else if (multiplier <= 10) {
            sufix = "yellow";
        } else {
            sufix = "red";
        }
        nodeBg.spriteFrame = mainAtlas.getSpriteFrame(`${name}-${sufix}`);
    }
}
