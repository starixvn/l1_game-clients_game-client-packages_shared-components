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
            let chips = {};

            const clientRoundId = this.roundStore.clientRoundId;
            // const fakeData = {
            //     big: {
            //         "0": 1,
            //         "10": 1,
            //         "20": 0,
            //         "50": 0,
            //         "100": 0,
            //         "200": 0,
            //         "250": 0,
            //         "500": 0,
            //     },
            //     specific6: {
            //         "0": 1,
            //         "10": 0,
            //         "20": 1,
            //         "50": 0,
            //         "100": 0,
            //         "200": 0,
            //         "250": 0,
            //         "500": 0,
            //     },
            //     small: {
            //         "0": 1,
            //         "10": 0,
            //         "20": 0,
            //         "50": 1,
            //         "100": 1,
            //         "200": 0,
            //         "250": 0,
            //         "500": 1,
            //     },
            //     anyTriple: {
            //         "0": 1,
            //         "10": 1,
            //         "20": 1,
            //         "50": 1,
            //         "100": 0,
            //         "200": 0,
            //         "250": 0,
            //         "500": 0,
            //     },
            // };
            // console.log("------before join game -TotalBetsChips", fakeData);
            // gc.Shared.utils.StorageManager.set("TotalBetsChips", { [clientRoundId]: fakeData });

            const chipsDataStorage = gc.Shared.utils.StorageManager.get("TotalBetsChips")?.[clientRoundId];
            console.log("------chipsDataStorage", chipsDataStorage);

            if (!chipsDataStorage) {
                gc.Shared.utils.StorageManager.remove("TotalBetsChips");
                chips = this.parseChipsFromTotalBets(totalBets);
                this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: chips });
            } else {
                // totalBets = {
                //     big: 1030,
                //     total15: 91.6,
                //     small: 533.74,
                //     total12: 85,
                //     anyTriple: 37.79,
                //     specific4: 14,
                //     specific6: 601.13,
                //     total11: 163,
                // };
                console.log("------join game -TotalBets", totalBets);
                Object.keys(totalBets).forEach((choice) => {
                    totalBets[choice] =
                        totalBets[choice] - (chipsDataStorage[choice] ? this.calculateTotalAmount(chipsDataStorage[choice]) : 0);
                });

                chips = this.parseChipsFromTotalBets(totalBets);

                Object.keys(totalBets).forEach((choice) => {
                    const betChoiceChips = chipsDataStorage[choice];
                    if (betChoiceChips) {
                        const combined = Object.keys(betChoiceChips).reduce((acc, key) => {
                            acc[key] = (betChoiceChips[key] || 0) + (chips[choice]?.[key] || 0);
                            return acc;
                        }, {});
                        chipsDataStorage[choice] = combined;
                    }
                });

                console.log("------TotalBetsChips", chipsDataStorage);
                gc.Shared.utils.StorageManager.set("TotalBetsChips", { [clientRoundId]: chipsDataStorage });
                this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: chipsDataStorage });
            }

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

    private calculateTotalAmount(chips: Record<string, number>): number {
        return Object.entries(chips).reduce((sum, [denomination, quantity]) => {
            return sum + parseFloat(denomination) * quantity;
        }, 0);
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

        return chips;
    }
}
