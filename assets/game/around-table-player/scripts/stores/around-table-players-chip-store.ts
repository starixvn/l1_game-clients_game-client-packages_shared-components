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
}

@injectable()
export class AroundTablePlayersChipStore {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(gc.Player.MainPlayerStore) private readonly mainPlayerStore: gc.Player.MainPlayerStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get aroundTablePlayerChip(): IAroundTablePlayerChip {
        const playerChip = this.chipStore.playerChip;
        if (playerChip) {
            const convertValue = gc.NumberUtils.getValueByCurrency(playerChip?.amount, this.mainPlayerStore.rate);
            const chipValues = getChipQuantity(convertValue, this.chipStore.chipValuesByStakeLevel);

            return {
                chipValues,
                playerChip,
            };
        }

        return null;
    }
}
