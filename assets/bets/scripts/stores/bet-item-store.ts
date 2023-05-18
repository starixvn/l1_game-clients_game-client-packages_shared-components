import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
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
}

export type TTotalChipBet = {
    [chipValue: string]: number;
};

export interface IOwnChip extends Chips {
    chipBet: number;
}

@injectable()
export class BetItemStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;

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
                        },
                    ];
                }
            });
        });

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
}
