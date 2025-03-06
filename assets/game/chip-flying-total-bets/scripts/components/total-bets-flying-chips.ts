import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { ChipFlying } from "../../../chip-flying/scripts/components/chip-flying";
import { IBetChoice, TotalBetsChipsHandler } from "../handlers/total-bets-chips-handlers";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("TotalBetsFlyingChips")
export class TotalBetsFlyingChips extends ChipFlying {
    @property
    supportChoices = "";

    useTotalBets = true;

    private get choices() {
        return this.supportChoices.split(",");
    }

    @render(gc.Rounds.RoundStore, (store) => store.totalBets, { fireImmediately: false })
    handleTotalBets(totalBets: IBetChoice) {
        const filterTotalBets = Object.fromEntries(Object.entries(totalBets).filter(([choice]) => this.choices.includes(choice)));
        this.handleTotalBetsChips(filterTotalBets);
    }

    @handle(TotalBetsChipsHandler)
    handleTotalBetsChips(totalBets: IBetChoice) {
        return totalBets;
    }
}
