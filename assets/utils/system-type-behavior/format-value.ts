import gc from "@sg/game-client-base";
const { FormatUtils } = gc;

export function formatValueBaseOnSystemType(value: number): string {
    return window.envConfig.systemType === "HD" 
        ? FormatUtils.numberWithCommas(value, 2)
        : FormatUtils.numberWithCommas(value);
}