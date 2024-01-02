import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, SpriteAtlas } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { CrashUtils } from "../crash-utils";

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

    setDisplay(isShowMultiplier: boolean, isShowCountDown: boolean, isShowSprInPlay: boolean) {
        this.nodeMultiplier.node.active = isShowMultiplier;
        this.nodeCountdown.active = isShowCountDown;
        this.nodeInPlay.active = isShowSprInPlay;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.countdownTimer)
    updateCountDownValue(countdownTimer: number) {
        if (countdownTimer <= this.START_BET_TIMER && countdownTimer > this.END_BET_TIMER) {
            if (!this.checkCrashedGame()) {
                this.lblCountdown.string = countdownTimer.toString();
                this.setDisplay(false, true, false);
            }
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.roundTime)
    showInPlayStatus(roundTime: number) {
        if (roundTime === 0 && !this.checkCrashedGame()) {
            this.setDisplay(false, false, true);
        }
    }

    updateMultiplierValue(value: number, name: string) {
        this.setDisplay(true, false, false);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
        CrashUtils.setSpriteFrameBg(value, this.nodeMultiplier, this.mainAtlas, name);
    }

    checkCrashedGame() {
        if (this.roundInfo.md5Result.hashValue && this.roundInfo.md5Result.rawValue) {
            return true;
        }
        return false;
    }

    @handle(GameCrash.Md5Popup.Md5PopupHandler, (handle, info: { isOpenPopupMd5: boolean; roundId: number }) => handle.handleMd5Popup(info))
    onClickRoundItem() {
        this.playSoundClick();
        return { isOpenPopupMd5: true, roundId: this.roundInfo.roundId };
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
