import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import inversify from "inversify";
import Observer from "observer";

import { getChipQuantity } from "../../../chip-flying/scripts/components/actions/fly-chip-to-box";

const { injectable, inject } = inversify;
const { ccclass, property } = _decorator;

export interface IBetChoice {
    [betChoice: string]: number;
}

const { render, handle } = Observer;

@injectable()
@ccclass("TotalBetsChipsHandler")
export class TotalBetsChipsHandler {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.RoundHistories.RoundHistoryStore) private readonly roundHistoryStore: gc.RoundHistories.RoundHistoryStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Chips.ChipHandlers) protected readonly chipHandlers: gc.Chips.ChipHandlers;

    private prevTotalBets: IBetChoice = {};
    private isFirstTotalBets = true;

    async handle(totalBets: IBetChoice) {
        if (!totalBets || this.isSameTotalBets(totalBets) || !this.roundHistoryStore.firstJoinGameHistory) {
            return;
        }

        if (this.isFirstTotalBets && this.roundHistoryStore.firstJoinGameHistory) {
            this.prevTotalBets = totalBets;
            const chips = this.parseChipsFromTotalBets(totalBets);

            console.log("-------chips", chips);
            this.chipHandlers.handleChips(chips);
            // this.chipStore.chips = chips;
            // this.chipStore.convertChips();
            this.isFirstTotalBets = false;
            return;
        }

        const offsetTotalBets = this.calculateOffsetTotalBets(totalBets);

        Object.keys(offsetTotalBets).forEach((choice) => {
            const playerChip = {
                playerId: `${Math.random()}`,
                betChoice: choice,
                amount: offsetTotalBets[choice],
                red: 1000,
            };
            this.chipStore.playerChip = playerChip;
        });
        this.prevTotalBets = totalBets;
    }

    private calculateOffsetTotalBets(totalBets: IBetChoice): IBetChoice {
        const offsetTotalBets: IBetChoice = {};

        Object.keys(totalBets).forEach((betChoice) => {
            const ownBetChoice = this.roundStore.ownBets?.[betChoice] ?? 0;
            const prevBet = this.prevTotalBets[betChoice] ?? 0;

            offsetTotalBets[betChoice] = totalBets[betChoice] - prevBet - ownBetChoice;
        });

        return offsetTotalBets;
    }

    private isSameTotalBets(totalBets: IBetChoice): boolean {
        return (
            this.prevTotalBets &&
            Object.keys(totalBets).length === Object.keys(this.prevTotalBets).length &&
            Object.keys(totalBets).every((key) => this.prevTotalBets.hasOwnProperty(key) && totalBets[key] === this.prevTotalBets[key])
        );
    }

    private parseChipsFromTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        if (!totalBets) {
            return;
        }
        let chips = {};
        Object.keys(totalBets).forEach((choice) => {
            const chipValues = getChipQuantity(totalBets[choice], this.chipStore.chipValuesByStakeLevel);
            const tempLowerChip = chipValues[0] ? { 0.5: chipValues[0] } : {};
            const newChipsWithLowerChips = Object.assign(
                tempLowerChip,
                Object.fromEntries(Object.entries(chipValues).filter(([key]) => key !== "0"))
            );

            chips[choice] = newChipsWithLowerChips;
        });

        return { [this.mainPlayerStore.rate]: chips };
    }
}
