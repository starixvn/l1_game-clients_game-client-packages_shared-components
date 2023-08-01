import gc from "@sg/game-client-base";
import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { getChipQuantity } from "../../../sliding-chip/scripts/components/actions";
import { AroundTablePlayerComponent } from "../components/around-table-player-component";

const { injectable, inject } = inversify;

export interface IAroundTablePlayers extends gc.GameServiceMessage.AroundTablePlayer {
    idleCount?: number;
}

export interface IHiddenPlayers {
    [playerId: string]: IAroundTablePlayers;
}

export interface INewPlayerInfo {
    playerComp: AroundTablePlayerComponent;
    value: IAroundTablePlayers;
}

export interface IAroundTablePlayerChip {
    playerChip: gc.GameServiceMessage.PlayerChip;
    chipValues: {
        [value: number]: number;
    };
}

export interface IAroundTablePlayerPlaceChip {
    chipValues: {
        [value: number]: number;
    };
    chipBox: Node;
    startNode: Node;
    isHiddenPlayer?: boolean;
}

@injectable()
export class AroundTablePlayersChipStore {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get aroundTablePlayerChip(): IAroundTablePlayerChip {
        const playerChip = this.chipStore.playerChip;
        if (playerChip) {
            const chipValues = getChipQuantity(playerChip?.amount, this.chipStore.chipValuesByStakeLevel);

            return {
                chipValues,
                playerChip,
            };
        }

        return null;
    }
}
