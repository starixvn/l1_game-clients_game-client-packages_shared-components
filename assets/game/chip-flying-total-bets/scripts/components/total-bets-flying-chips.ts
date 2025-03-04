import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { ChipFlying } from "../../../chip-flying/scripts/components/chip-flying";
import { IBetChoice, TotalBetsChipsHandler } from "../handlers/total-bets-chips-handlers";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("TotalBetsFlyingChips")
export class TotalBetsFlyingChips extends ChipFlying {
    isTotalBets = true;

    @render(gc.Rounds.RoundStore, (store) => store.totalBets, { fireImmediately: false })
    handleTotalBets(totalBets: IBetChoice) {
        this.handleTotalBetsChips(totalBets);
    }

    @handle(TotalBetsChipsHandler)
    handleTotalBetsChips(totalBets: IBetChoice) {
        return totalBets;
    }
}
