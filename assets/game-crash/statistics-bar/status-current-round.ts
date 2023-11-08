import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, SpriteAtlas } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { CrashUtils } from "../crash-utils";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, Rounds, Settlements } = gc;

@ccclass
export class StatusCurrentRound extends ObserverComponent {
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

    public isCurrentRound = true;

    showHideNode(isShowMultiplier: boolean, isShowCountDown: boolean, isShowSprInPlay: boolean) {
        this.nodeMultiplier.node.active = isShowMultiplier;
        this.lblCountdown.node.active = isShowCountDown;
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
            if (this.isCurrentRound) {
                this.updateCountDownValue(countdownTimer);
            }
        }
    }
    updateCountDownValue(value: number) {
        this.lblCountdown.string = `${value}s`;
        this.showHideNode(false, true, false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.remaining)
    showInPlayStatus(remaining: number) {
        if (remaining === 0 && this.isCurrentRound) {
            this.showHideNode(false, false, true);
        }
    }

    updateMultiplierValue(value: number, name: string) {
        this.showHideNode(true, false, false);
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(value, 2, false)}x`;
        CrashUtils.setSpriteFrameBg(value, this.nodeMultiplier, this.mainAtlas, name);
    }
}
