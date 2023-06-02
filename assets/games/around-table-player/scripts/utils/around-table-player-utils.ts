import gc from "game-client-base";
import { find } from "lodash-es";
import BetItem from "../../../../bets/scripts/components/bet-item";
import { FunctionUtils } from "../../../../utils";
import { AroundTablePlayerComponent } from "../components/around-table-player-component";
import { IAroundTablePlayers } from "../stores/around-table-players-store";
const { Shared } = gc;

export namespace AroundTablePlayerUtils {
    export const findIdleHiddenPlayer = (hiddenPlayers: IAroundTablePlayers[]) => {
        return hiddenPlayers.find((player) => player.idleCount <= AroundTablePlayerComponent.maxIdleCount);
    };

    export const findIdleRealPlayer = (realPlayers: IAroundTablePlayers[]) => {
        return realPlayers.find((player) => player.idleCount <= AroundTablePlayerComponent.maxIdleCount);
    };

    export const getBotAroundTablePlayerComps = (playersComponent: AroundTablePlayerComponent[]): AroundTablePlayerComponent[] => {
        return playersComponent.filter((player) => player?.aroundTablePlayer?.type);
    };

    export const getRealPlayer = (hiddenPlayers: IAroundTablePlayers[]): IAroundTablePlayers[] => {
        return hiddenPlayers.filter((player) => player && !player.type);
    };

    export const getAroundTablePlayerSlot = (
        playersComponent: AroundTablePlayerComponent[],
        playerId: string
    ): AroundTablePlayerComponent => {
        return find(
            playersComponent,
            (player: AroundTablePlayerComponent) => player.aroundTablePlayer && player.aroundTablePlayer?.id === playerId
        );
    };

    export const getPlayerFromCache = (playerId: string) => {
        const players = Shared.utils.StorageManager.get(aroundTablePlayersCacheKey());

        return players ? players[playerId] : null;
    };

    export const getEmptyPlayerSlot = (playersComponent: AroundTablePlayerComponent[]): AroundTablePlayerComponent => {
        return find(playersComponent, (player: AroundTablePlayerComponent) => !player.aroundTablePlayer?.id);
    };

    export const aroundTablePlayersCacheKey = (): string => {
        const gameName = FunctionUtils.getNamespace();
        return `PLAYERS_${gameName}`;
    };

    export const storePlayerToCache = (player: IAroundTablePlayers) => {
        if (player.type) {
            return;
        }

        let players = Shared.utils.StorageManager.get(aroundTablePlayersCacheKey());

        if (!players) {
            players = {};
        }

        players[player.id] = player;
        Shared.utils.StorageManager.set(aroundTablePlayersCacheKey(), players);
    };

    export const getBetItem = (betItems: BetItem[], betChoice: string): BetItem => {
        return find(betItems, (item: BetItem) => item.betChoice === betChoice);
    };
}
