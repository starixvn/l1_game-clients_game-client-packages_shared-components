import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import { filter } from "lodash-es";
import mobx from "mobx";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
import { NumberUtils } from "../../../utils";
import BetItem from "../components/bet-item";

const { injectable, inject } = inversify;

interface Chips {
    slidingChip: SlidingChip;
    chipBox: Node;
}

export interface IPlayersChips extends Chips {
    chipAmount: TChipAmount;
}

export type TChipAmount = {
    [chipValue: string]: number;
};

export interface IOwnChip extends Chips {
    chipAmount: number;
}

export interface IVisiblePlayersChip extends Chips {
    chipAmount: number;
    startNode: Node;
    delayTime: number;
}

export interface TBetStartingRound {
    isStartingRound: boolean;
    settlementResult: gc.GameServiceMessage.TSettlementResult;
}

@injectable()
export class BetItemStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _betItems: BetItem[] = [];

    get betItems() {
        return this._betItems;
    }

    get playersChips() {
        const players: IPlayersChips[] = [];
        const chips = this.chipStore.chips;

        if (this.roundTimeStore.isLocking || this.roundTimeStore.isPlacingBet) {
            for (const rate in chips) {
                const chipValues = chips[rate];

                for (const betItem of this.betItems) {
                    const chipAmount = chipValues[betItem.betChoice];

                    if (chipAmount) {
                        const chipAmountConvert = this.getChipValueByCurrency(chipAmount, this.mainPlayerStore.rate, +rate);

                        players.push({
                            chipBox: betItem.chipBox,
                            chipAmount: chipAmountConvert,
                            slidingChip: this.slidingChipStore.slidingChip,
                        });
                    }
                }
            }
        }
        return players;
    }

    getChipValueByCurrency(chipAmount: TChipAmount, playerRate: number, chipRate: number) {
        const chipAmountConvert: TChipAmount = {};
        for (const chipValue in chipAmount) {
            const convertChipValue = NumberUtils.getValueByCurrency(+chipValue, playerRate, chipRate);

            chipAmountConvert[convertChipValue] = chipAmount[chipValue];
        }

        return chipAmountConvert;
    }

    get ownChip(): IOwnChip {
        const { betChoice, amount } = this.chipStore.ownChip;
        const betItem = this.betItems.find((item) => betChoice === item.betChoice);

        return {
            slidingChip: this.slidingChipStore.slidingChip,
            chipBox: betItem?.chipBox,
            chipAmount: amount,
        };
    }

    setBetItems(betItem: BetItem) {
        this._betItems = [...this.betItems, betItem];
    }

    get lostBetItems(): BetItem[] {
        return filter(this.betItems, (item: BetItem) => !this.settlementStore.settlementResult[item.betChoice]);
    }

    get winBetItems(): BetItem[] {
        return filter(this.betItems, (item: BetItem) => this.settlementStore.settlementResult[item.betChoice]);
    }

    get getBetStartingRoundInfo() {
        return {
            isStartingRound: this.roundTimeStore.isStartingRound,
            settlementResult: this.settlementStore.settlementResult,
        };
    }
}
