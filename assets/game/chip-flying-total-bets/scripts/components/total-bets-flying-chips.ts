import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { ChipFlying } from "../../../chip-flying/scripts/components/chip-flying";
import { IBetChoice, TotalBetsChipsHandler } from "../handlers/total-bets-chips-handlers";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("TotalBetsFlyingChips")
export class TotalBetsFlyingChips extends ChipFlying {
    override useFakeChip = true;

    @render(gc.Rounds.RoundStore, (store) => store.totalBets, { fireImmediately: false })
    handleTotalBets(totalBets: IBetChoice) {
        const filterEntries = Object.entries(totalBets).filter(([choice]) => this.validChoices.includes(choice));

        const filterTotalBets = Object.fromEntries(
            filterEntries.map(([key, value]) => [key, Number(value.toFixed(4))])
        );
        
        this.handleTotalBetsChips(filterTotalBets);
    }

    @handle(TotalBetsChipsHandler)
    handleTotalBetsChips(totalBets: IBetChoice) {
        return totalBets;
    }
}
