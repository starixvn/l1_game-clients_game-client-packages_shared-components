import gc from "@sg/game-client-base";
import { tween } from "cc";

export namespace NumberUtils {
    export const getChipFormatter = (num: number, digits = 0) => {
        const si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "K" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        if (num < 1e3) {
            return `${num}`;
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    };

    export const numberTo = (label, end, duration, currency = false) => {
        const endString = currency ? gc.FormatUtils.numberWithCommas(end, 1) : end;
        if (label.string === endString) {
            return;
        }
        const start = parseFloat(label.string.replace(/,/g, "")) || 0;
        const range = end - start;
        const stepCount = 20;
        const stepTime = duration / stepCount;
        const stepValue = range / stepCount;
        let step = 0;
        tween(label.node)
            .repeat(
                stepCount,
                tween()
                    .delay(stepTime)
                    .call(() => {
                        const value = start + step * stepValue;
                        label.string = currency ? gc.FormatUtils.numberWithCommas(value, 1) : value;
                        step++;
                    })
            )
            .call(() => {
                label.string = endString;
            })
            .start();
    };
}
