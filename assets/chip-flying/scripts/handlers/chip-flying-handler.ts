import { Node } from "cc";
import inversify from "inversify";
import { ChipFlyingStore } from "../stores/chip-flying.store";

const { injectable, inject } = inversify;

export namespace ChipFlyingHandlers {
    @injectable()
    export class SetOtherUsers {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(otherUsers: Node) {
            this.chipFlyingStore.otherUsers = otherUsers;
        }
    }

    @injectable()
    export class SetBoxChip {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(boxChip: Node) {
            this.chipFlyingStore.boxChip = boxChip;
        }
    }

    @injectable()
    export class SetOwnerUser {
        @inject(ChipFlyingStore) private readonly chipFlyingStore: ChipFlyingStore;

        async handle(ownerUser: Node) {
            this.chipFlyingStore.ownerUser = ownerUser;
        }
    }
}
