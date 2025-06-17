import gc from "@sg/game-client-base";
import { systemTypes, SystemTypeUtils } from "./system-type-behavior";
const { FormatUtils } = gc;

export function formatValueBaseOnSystemType(value: number): string {
    return SystemTypeUtils.isSystemType(systemTypes?.HD) 
        ? FormatUtils.numberWithCommas(value, 2)
        : FormatUtils.numberWithCommas(value);
}