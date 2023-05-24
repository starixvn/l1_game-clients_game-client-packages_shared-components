import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import { filter } from "lodash-es";
import mobx from "mobx";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
import { ObjectUtils } from "../../../utils";
import BetItem from "../components/bet-item";

const { injectable, inject } = inversify;

interface Chips {
    slidingChip: SlidingChip;
    chipBox: Node;
}

export interface IOwnChips extends Chips {
    totalChipBet: TTotalChipBet;
    playerRate: number;
    chipRate: number;
}

export type TTotalChipBet = {
    [chipValue: string]: number;
};

export interface IOwnChip extends Chips {
    chipBet: number;
}

export interface TBetStartingRound {
    isStartingRound: boolean;
    settlementResult: gc.GameServiceMessage.TResult;
}

@injectable()
export class BetItemStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.PlayerStore) private readonly playerStore: gc.Player.PlayerStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _betItems: BetItem[] = [];

    get betItems() {
        return this._betItems;
    }

    get ownChips() {
        let ownChips: IOwnChips[] = [];
        const chips = this.chipStore.chips;
        if (this.roundTimeStore.isLocking || this.roundTimeStore.isPlacingBet) {
            Object.keys(chips).forEach((rate) => {
                const chipValues = chips[rate];
                const chipsKeys = ObjectUtils.getLowercaseObjectKeys(chipValues);
                this.betItems.forEach((betItem) => {
                    const totalChipBet = chipValues[chipsKeys[betItem.node.name.toLowerCase()]];
                    if (totalChipBet) {
                        ownChips = [
                            ...ownChips,
                            {
                                chipBox: betItem.chipBox,
                                totalChipBet,
                                slidingChip: this.slidingChipStore.slidingChip,
                                playerRate: this.playerStore.rate,
                                chipRate: +rate,
                            },
                        ];
                    }
                });
            });
        }

        return ownChips;
    }

    get ownChip() {
        const { betChoice, amount } = this.chipStore.ownChip;

        const betItem = this.betItems.find((item) => betChoice === item.node.name);
        if (!betItem) {
            return {};
        }

        return {
            slidingChip: this.slidingChipStore.slidingChip,
            chipBox: betItem.chipBox,
            chipBet: amount,
        };
    }

    setBetItems(betItem: BetItem) {
        this._betItems = [...this.betItems, betItem];
    }

    get settlementResultKeys() {
        return ObjectUtils.getLowercaseObjectKeys(this.settlementStore.settlementResult);
    }

    get lostBetItems(): BetItem[] {
        return filter(
            this.betItems,
            (item: BetItem) => !this.settlementStore.settlementResult[this.settlementResultKeys[item.node.name.toLowerCase()]]
        );
    }

    get winBetItems(): BetItem[] {
        return filter(
            this.betItems,
            (item: BetItem) => !!this.settlementStore.settlementResult[this.settlementResultKeys[item.node.name.toLowerCase()]]
        );
    }

    get getBetStartingRoundInfo() {
        return {
            isStartingRound: this.roundTimeStore.isStartingRound,
            settlementResult: this.settlementStore.settlementResult,
        };
    }
}
