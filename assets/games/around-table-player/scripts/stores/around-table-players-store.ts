import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import { remove, values } from "lodash-es";
import mobx from "mobx";
import BetItem from "../../../../bets/scripts/components/bet-item";
import { BetItemStore } from "../../../../bets/scripts/stores/bet-item-store";
import { HiddenPlayersStore } from "../../../../chip-flying/scripts/stores/hidden-players-store";
import { getChipQuantity } from "../../../../sliding-chip/scripts/components/actions";
import SlidingChip from "../../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../../sliding-chip/scripts/stores/sliding-chip-store";
import { NumberUtils } from "../../../../utils";
import { AroundTablePlayerComponent } from "../components/around-table-player-component";
import { AroundTablePlayerUtils } from "../utils";

const { injectable, inject } = inversify;

export interface IAroundTablePlayers extends gc.GameServiceMessage.Player {
    idleCount?: number;
    rate?: number;
}

export interface IHiddenPlayers {
    [playerId: string]: IAroundTablePlayers;
}

export interface IPlayerInfo {
    playerComp: AroundTablePlayerComponent;
    value: IAroundTablePlayers;
}

export interface IAroundTablePlayerPlaceChip {
    playerChip: gc.GameServiceMessage.PlayerChip;
    chipBox: Node;
    chipValues: {
        [value: number]: number;
    };
    startNode: Node;
    slidingChip: SlidingChip;
}

@injectable()
export class AroundTablePlayersStore {
    @inject(gc.Chips.ChipStore) private readonly chipStore: gc.Chips.ChipStore;
    @inject(BetItemStore) private readonly betItemStore: BetItemStore;
    @inject(gc.Player.PlayerStore) private readonly playerStore: gc.Player.PlayerStore;
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(HiddenPlayersStore) private readonly hiddenPlayersStore: HiddenPlayersStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    hiddenPlayers: IHiddenPlayers;
    private _aroundTablePlayersComponent: AroundTablePlayerComponent[] = [];
    private _playerInfo: IPlayerInfo = null;

    get aroundTablePlayersComponent() {
        return this._aroundTablePlayersComponent;
    }

    get playerInfo() {
        return this._playerInfo;
    }

    set playerInfo(playerInfo: IPlayerInfo) {
        this._playerInfo = playerInfo;
    }

    setPlayersComp(aroundTablePlayerComponent: AroundTablePlayerComponent) {
        this._aroundTablePlayersComponent = [...this.aroundTablePlayersComponent, aroundTablePlayerComponent];
    }

    removePlayer(playerOutGame: gc.GameServiceMessage.OutGame) {
        const { playerId } = playerOutGame;

        if (!playerId) {
            return;
        }

        const playerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayersComponent, playerId);
        if (playerSlot) {
            this.playerInfo = {
                playerComp: playerSlot,
                value: null,
            };
            const playerIds = Object.keys(this.hiddenPlayers);

            if (playerIds.length > 0) {
                const newPlayerId = playerIds[0];
                const newPlayer = this.hiddenPlayers[newPlayerId];
                this.addPlayer(newPlayer);
                delete this.hiddenPlayers[newPlayerId];
            }
        } else {
            delete this.hiddenPlayers[playerId];
        }
    }

    addPlayers(playersInfo: gc.GameServiceMessage.Players) {
        const players: IAroundTablePlayers[] = Object.values(playersInfo);
        const realPlayers: IAroundTablePlayers[] = players.filter((player: IAroundTablePlayers) => !player.type);
        const botPlayers: IAroundTablePlayers[] = players.filter((player: IAroundTablePlayers) => player.type);

        const addPlayerToTable = (player: IAroundTablePlayers) => {
            this.addPlayer(player);
        };

        realPlayers.forEach(addPlayerToTable);
        botPlayers.forEach(addPlayerToTable);
    }

    addPlayer(player: IAroundTablePlayers) {
        if (player) {
            const playerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayersComponent, player.id);
            const playerFromCache = AroundTablePlayerUtils.getPlayerFromCache(player.id);
            player.idleCount = playerFromCache ? playerFromCache.idleCount : 0;

            if (!playerSlot) {
                const emptySlot = AroundTablePlayerUtils.getEmptyPlayerSlot(this.aroundTablePlayersComponent);

                if (emptySlot && player.idleCount <= AroundTablePlayerComponent.maxIdleCount) {
                    this.playerInfo = {
                        playerComp: emptySlot,
                        value: player,
                    };

                    return;
                }

                this.hiddenPlayers[player.id] = player;
            }
        }
    }

    async figureOutAroundTablePlayers() {
        const hiddenPlayers: IAroundTablePlayers[] = values(this.hiddenPlayers);
        for (const player of this.aroundTablePlayersComponent) {
            const aroundTablePlayer = player.aroundTablePlayer;
            if (!aroundTablePlayer) {
                return;
            }

            aroundTablePlayer.idleCount++;
            AroundTablePlayerUtils.storePlayerToCache(aroundTablePlayer);

            if (player.isIdle) {
                await this.handleIdleAroundTablePlayer(player, aroundTablePlayer, hiddenPlayers);
            }
        }

        const botAroundTablePlayerPlayerComps = AroundTablePlayerUtils.getBotAroundTablePlayerComps(this.aroundTablePlayersComponent);
        const realPlayers = AroundTablePlayerUtils.getRealPlayer(hiddenPlayers);

        for (const botAroundTablePlayer of botAroundTablePlayerPlayerComps) {
            const aroundTablePlayer = botAroundTablePlayer.aroundTablePlayer;
            const realPlayer = AroundTablePlayerUtils.findIdleRealPlayer(realPlayers);
            if (realPlayer) {
                await this.updatePlayerInfoAndSwap(aroundTablePlayer, realPlayer, botAroundTablePlayer);
                delete this.hiddenPlayers[realPlayer.id];
                remove(realPlayers, realPlayer);
            }
        }
    }

    protected async handleIdleAroundTablePlayer(
        aroundTablePlayerComp: AroundTablePlayerComponent,
        aroundTablePlayer: IAroundTablePlayers,
        hiddenPlayers: IAroundTablePlayers[]
    ) {
        const oldPlayerData = aroundTablePlayer;
        const newPlayer = AroundTablePlayerUtils.findIdleHiddenPlayer(hiddenPlayers);

        if (newPlayer) {
            await aroundTablePlayerComp.setInfo(newPlayer);
            delete this.hiddenPlayers[newPlayer.id];
            this.hiddenPlayers[oldPlayerData.id] = oldPlayerData;
            remove(hiddenPlayers, newPlayer);
        }
    }

    protected async updatePlayerInfoAndSwap(
        aroundTablePlayer: IAroundTablePlayers,
        realPlayer: IAroundTablePlayers,
        botAroundTablePlayer: AroundTablePlayerComponent
    ) {
        this.hiddenPlayers[aroundTablePlayer.id] = aroundTablePlayer;
        await botAroundTablePlayer.setInfo(realPlayer);
    }

    get aroundTablePlayerPlaceChip(): IAroundTablePlayerPlaceChip {
        const playerChip = this.chipStore.playerChip;
        if (playerChip) {
            const { betChoice, amount, playerId } = this.chipStore.playerChip;
            let startNode: Node;
            const aroundTablePlayer = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayersComponent, playerId);
            const betItem: BetItem = AroundTablePlayerUtils.getBetItem(this.betItemStore.betItems, betChoice);

            if (aroundTablePlayer) {
                this.updatePlayerSlotDataStorage(playerChip, aroundTablePlayer);
                startNode = aroundTablePlayer.avatar.node;
            } else {
                startNode = this.hiddenPlayersStore.hiddenPlayersNode;
                this.updateHiddenPlayerStorage(playerChip);
            }

            const convertValue = NumberUtils.getValueByCurrency(amount, this.playerStore.rate);
            const chipValues = getChipQuantity(convertValue, this.slidingChipStore.chipValues);

            return {
                chipValues,
                chipBox: betItem.chipBox,
                startNode,
                slidingChip: this.slidingChipStore.slidingChip,
                playerChip,
            };
        }

        return null;
    }

    protected updatePlayerSlotDataStorage(playerChip: gc.GameServiceMessage.PlayerChip, playerSlot: AroundTablePlayerComponent) {
        playerSlot.setBalance(playerChip.red);
        playerSlot.aroundTablePlayer.idleCount = 0;
        AroundTablePlayerUtils.storePlayerToCache(playerSlot.aroundTablePlayer);
    }

    protected updateHiddenPlayerStorage(playerChip: gc.GameServiceMessage.PlayerChip) {
        const player = this.hiddenPlayers?.[playerChip?.playerId];

        if (player) {
            player.idleCount = 0;
            player.red = playerChip.red;
            this.hiddenPlayers[playerChip.playerId] = player;
            AroundTablePlayerUtils.storePlayerToCache(player);
        }
    }
}
