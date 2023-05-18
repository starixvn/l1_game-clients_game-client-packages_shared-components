import inversify from "inversify";
import BetItem from "../components/bet-item";
import { BetItemStore } from "../stores/bet-item-store";

const { injectable, inject } = inversify;

export namespace BetItemHandlers {
    @injectable()
    export class SetBetItems {
        @inject(BetItemStore) private readonly betItemStore: BetItemStore;

        async handle(betItem: BetItem) {
            this.betItemStore.setBetItems(betItem);
        }
    }
}
