import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
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
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Chips.ChipHandlers) protected readonly chipHandlers: gc.Chips.ChipHandlers;
    @inject(gc.GameConfigs.GameConfigStore) protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;

    private prevTotalBets: IBetChoice = {};
    private timeoutIds: NodeJS.Timeout[] = [];

    constructor() {
        setTimeout(() => {
            mobx.reaction(
                () => this.settlementStore.currentFinish,
                (currentFinish) => {
                    if (currentFinish) {
                        this.prevTotalBets = {};
                    }
                }
            );
        }, 0);
    }

    async handle(totalBets: IBetChoice) {
        this.clearAllTimeouts();

        if (!totalBets || this.isSameTotalBets(totalBets) || !this.gameConfigStore.initialized) {
            return;
        }

        if (!this.prevTotalBets) {
            this.prevTotalBets = totalBets;
            let chips = {};

            const clientRoundId = this.roundStore.clientRoundId;
            const chipsDataStorage = gc.Shared.utils.StorageManager.get("TotalBetsChips")?.[clientRoundId];

            if (!chipsDataStorage) {
                gc.Shared.utils.StorageManager.remove("TotalBetsChips");
                chips = this.parseChipsFromTotalBets(totalBets);
                this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: chips });
            } else {
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

                gc.Shared.utils.StorageManager.set("TotalBetsChips", { [clientRoundId]: chipsDataStorage });
                this.chipHandlers.handleChips({ [this.mainPlayerStore.rate]: chipsDataStorage });
            }

            return;
        }

        const offsetTotalBets = this.calculateOffsetTotalBets(totalBets);
        Object.keys(offsetTotalBets).forEach((choice) => {
            const playerChip = {
                playerId: "123",
                betChoice: choice,
                amount: offsetTotalBets[choice],
                red: 1000,
            };
            const timeoutId = setTimeout(() => {
                this.chipStore.playerChip = playerChip;
            }, 0);

            this.timeoutIds.push(timeoutId);
        });
        this.prevTotalBets = totalBets;
    }

    private clearAllTimeouts() {
        this.timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
        this.timeoutIds = [];
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
