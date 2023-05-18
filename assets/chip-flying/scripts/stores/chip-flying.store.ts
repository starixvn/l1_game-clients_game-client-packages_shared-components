import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
const { injectable, inject } = inversify;

@injectable()
export class ChipFlyingStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _otherUsers: Node = null;
    private _boxChip: Node = null;
    private _ownerUser: Node = null;

    get otherUsers() {
        return this._otherUsers;
    }

    set otherUsers(otherUsers: Node) {
        this._otherUsers = otherUsers;
    }

    get boxChip() {
        return this._boxChip;
    }

    set boxChip(boxChip: Node) {
        this._boxChip = boxChip;
    }

    get ownerUser() {
        return this._ownerUser;
    }

    set ownerUser(ownerUser: Node) {
        this._ownerUser = ownerUser;
    }
}
