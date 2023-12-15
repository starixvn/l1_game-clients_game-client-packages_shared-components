import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, SpriteAtlas } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { CrashRoundHistory } from "../crash-round-history/crash-round-history-store";
import { CrashUtils } from "../crash-utils";
import { Md5PopupHandler } from "../md5-popup/scripts/handlers/md5-popup-handlers";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, Rounds, Settlements } = gc;

@ccclass
export class RoundHistoryItem extends ObserverComponent {
    @property(Node)
    nodeCountdown: Node = null;

    @property(Sprite)
    nodeMultiplier: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Node)
    nodeInPlay: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    public isLastRound = false;

    public roundInfo: CrashRoundHistory = null;

    showHideNode(isShowMultiplier: boolean, isShowCountDown: boolean, isShowSprInPlay: boolean) {
        this.nodeMultiplier.node.active = isShowMultiplier;
        this.nodeCountdown.active = isShowCountDown;
        this.nodeInPlay.active = isShowSprInPlay;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => ({
        countdownTimer: store.countdownTimer,
        isPlacingBet: store.isPlacingBet,
        isLockingBet: store.isLocking,
    }))
    updateLabelText({
        countdownTimer,
        isPlacingBet,
        isLockingBet,
    }: {
        countdownTimer: number;
        isPlacingBet: boolean;
        isLockingBet: boolean;
    }) {
        if (countdownTimer < 11 && countdownTimer > 0 && (isPlacingBet || isLockingBet)) {
            if (!this.checkCrashedGame()) {
                this.updateCountDownValue(countdownTimer);
            }
        }
    }
    updateCountDownValue(value: number) {
        this.nodeCountdown.getChildByName("value").getComponent(Label).string = value.toString();
        this.showHideNode(false, true, false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.remaining)
    showInPlayStatus(remaining: number) {
        if (remaining === 0 && !this.checkCrashedGame()) {
            this.showHideNode(false, false, true);
        }
    }

    updateMultiplierValue(value: number, name: string) {
        this.showHideNode(true, false, false);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
        CrashUtils.setSpriteFrameBg(value, this.nodeMultiplier, this.mainAtlas, name);
    }

    checkCrashedGame() {
        if (this.roundInfo.md5Result.hashValue && this.roundInfo.md5Result.rawValue) {
            return true;
        }
        return false;
    }

    @handle(Md5PopupHandler, (handle, info: { isOpenPopupMd5: boolean; roundId: number }) => handle.handleMd5Popup(info))
    onClickRoundItem() {
        this.playSoundClick();
        return { isOpenPopupMd5: true, roundId: this.roundInfo.roundId };
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
