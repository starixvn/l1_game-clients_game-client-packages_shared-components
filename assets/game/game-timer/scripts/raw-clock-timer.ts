import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import moment from "moment";
import RawTimer from "./raw-timer";
const { Rounds } = gc;
const { ccclass, property } = _decorator;

@ccclass()
export default class RawClockTimer extends RawTimer {
    @property({ type: Label })
    digits: Label[] = [];

    getTimeChars(time: number): string[] {
        const formatTime = this.digits.length === 4 ? "mm:ss" : "HH:mm:ss";
        const timeText = moment.utc(time * 1000).format(formatTime);
        return Array.from(timeText).filter((char) => char !== ":");
    }

    setTime(time: number) {
        this.node.active = true;
        const timeChars = this.getTimeChars(time);
        this.digits.forEach((digit, index) => {
            const animated = digit.string !== timeChars[index];
            digit.string = timeChars[index];
            if (animated) {
                this.handleBetTimeAnimation(digit.node);
            }
        });
    }

    resetTime() {
        this.digits.forEach((digit) => {
            digit.string = "0";
        });
    }
}
