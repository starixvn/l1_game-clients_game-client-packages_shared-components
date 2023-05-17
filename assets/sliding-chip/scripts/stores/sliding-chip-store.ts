import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

export type TBetItem = {
    chipBox: Node;
    bet: number;
};
@injectable()
export class SlidingChipStore {
    @inject(gc.GameConfigs.GameConfigStore)
    protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;

    @inject(gc.Player.PlayerStore)
    protected readonly playerStore: gc.Player.PlayerStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _chipValues: number[] = [];
    chipsLength = 0;
    isResetScrollViewOffset = false;
    private _currentChip = "0";
    private _selectChip = 0;
    private _betItem: TBetItem = {
        chipBox: null,
        bet: 0,
    };

    set selectChip(index: number) {
        this._selectChip = index;
    }
    get selectChip() {
        return this._selectChip;
    }

    set betItem(data: TBetItem) {
        this._betItem = data;
    }
    get betItem() {
        return this._betItem;
    }

    onLoad(minChipSelect: number) {
        this._selectChip = minChipSelect;
    }

    handleClickNext(step: number) {
        this._selectChip += step;
    }

    handleClickPrev(step: number) {
        this._selectChip -= step;
    }

    set currentChip(value: string) {
        this._currentChip = value;
    }

    get currentChip() {
        return this._currentChip;
    }

    set chipValues(chips: number[]) {
        this._chipValues = chips;
    }

    get chipValues() {
        return this._chipValues;
    }

    setChipValuesByStakeLevel() {
        let minBet = this.gameConfigStore.minBet;
        let maxBet = this.gameConfigStore.maxBet;

        const userStakeLevel = this.playerStore.stakeLevel;
        minBet = Math.max(userStakeLevel.minBet, minBet);
        maxBet = Math.min(userStakeLevel.maxBet, maxBet);
        const result = this.gameConfigStore.chips.map((a) => +a).filter((value) => value >= minBet && value <= maxBet);

        this.chipValues = result;
    }

    handleSelectChip(displayMin: number, displaySize: number) {
        if (this.selectChip < displayMin) {
            const selectedIndex = displayMin;
            this.selectChip = Math.min(selectedIndex, this.chipsLength - displaySize);
        } else if (this.selectChip > displayMin + displaySize - 1) {
            this.selectChip = displayMin + displaySize - 1;
        }
    }

    resetBet() {
        this.currentChip = "0";
        this.selectChip = 0;
    }
}
