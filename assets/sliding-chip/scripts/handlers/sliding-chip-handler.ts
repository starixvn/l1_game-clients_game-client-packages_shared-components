import gc from "game-client-base";
import inversify from "inversify";
import { SlidingChipStore } from "../stores/sliding-chip-store";

const { injectable, inject } = inversify;
export namespace SlidingChipHandler {
    @injectable()
    export class ClickArrow {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handleNext({ chipMovingStep }) {
            this.slidingChipStore.handleClickNext(chipMovingStep);
        }

        async handlePrev({ chipMovingStep }) {
            this.slidingChipStore.handleClickPrev(chipMovingStep);
        }
    }

    @injectable()
    export class CreateChips implements gc.Shared.IHandler<{ chipsLength: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ chipsLength }) {
            this.slidingChipStore.chipsLength = chipsLength;
        }
    }

    @injectable()
    export class UpdateChips implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
        @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

        async handle() {
            const chipValues = this.slidingChipStore.chipValues;
            const currentBet =
                chipValues.findIndex((value) => parseInt(value.toString()) === parseInt(this.slidingChipStore.currentChip)) !== -1
                    ? this.slidingChipStore.currentChip
                    : chipValues[0] && chipValues[0].toString();
            if (currentBet === undefined) {
                return;
            }
            this.slidingChipStore.isResetScrollViewOffset = currentBet !== this.slidingChipStore.currentChip;
            this.slidingChipStore.currentChip = currentBet;
            this.betStore.amount = +currentBet;
        }
    }

    @injectable()
    export class SetChipValues implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle() {
            this.slidingChipStore.resetBet();
            this.slidingChipStore.setChipValuesByStakeLevel();
        }
    }

    @injectable()
    export class UpdateSelectChip implements gc.Shared.IHandler<{ displayMin: number; displaySize: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ displayMin, displaySize }) {
            this.slidingChipStore.handleSelectChip(displayMin, displaySize);
        }
    }

    @injectable()
    export class SetSelectChipAndScroll implements gc.Shared.IHandler<{ selectedChip: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ selectedChip }) {
            this.slidingChipStore.selectChip = selectedChip;
        }
    }

    @injectable()
    export class UpdateCurrentBet implements gc.Shared.IHandler<{ bet: string }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
        @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

        async handle({ bet }) {
            this.slidingChipStore.currentChip = bet;
            this.betStore.amount = +bet;
        }
    }

    @injectable()
    export class FlyChip implements gc.Shared.IHandler<{ chipBox: Node; amount: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ chipBox, amount }) {
            this.slidingChipStore.betItem = { chipBox, bet: amount };
        }
    }
}
