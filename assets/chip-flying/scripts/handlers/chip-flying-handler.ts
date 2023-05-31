import { Node } from "cc";
import inversify from "inversify";
import { ChipFlying } from "../components/chip-flying";
import { ChipFlyingStore } from "../stores/chip-flying.store";

const { injectable, inject } = inversify;

export namespace ChipFlyingHandlers {
    @injectable()
    export class SetHiddenPlayers {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(hiddenPlayers: Node) {
            this.chipFlyingStore.hiddenPlayersNode = hiddenPlayers;
        }
    }

    @injectable()
    export class SetDealerChipBox {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(boxChip: Node) {
            this.chipFlyingStore.boxChip = boxChip;
        }
    }

    @injectable()
    export class SetChipFlying {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(chipFlying: ChipFlying) {
            this.chipFlyingStore.chipFlying = chipFlying;
        }
    }
}
