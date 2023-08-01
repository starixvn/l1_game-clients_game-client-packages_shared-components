import gc from "@sg/game-client-base";
import { Node, _decorator, tween } from "cc";
import { remove, values } from "lodash-es";
import Observer from "observer";
import BetItem from "../../../bets/scripts/components/bet-item";
import { BetItems } from "../../../bets/scripts/components/bet-items";
import { placeChipToChipBox } from "../../../sliding-chip/scripts/components/actions";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import {
    AroundTablePlayersChipStore,
    IAroundTablePlayerChip,
    IAroundTablePlayerPlaceChip,
    IAroundTablePlayers,
    IHiddenPlayers,
} from "../stores/around-table-players-chip-store";
import { AroundTablePlayerUtils } from "../utils";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
import { AroundTablePlayerComponent } from "./around-table-player-component";

const { ccclass, property } = _decorator;

const { Rounds } = gc;
const { render } = Observer;

@ccclass
export class AroundTablePlayers extends ObserverComponent {
    @property(SlidingChip)
    slidingChip: SlidingChip = null;

    @property(Node)
    hiddenPlayersNode: Node = null;

    @property(BetItems)
    betItems: BetItems = null;

    protected aroundTablePlayerChip = [];
    protected isFlyChipSlow = true;
    protected hiddenPlayers: IHiddenPlayers = {};
    aroundTablePlayerComponents: AroundTablePlayerComponent[] = [];

    onLoad(): void {
        super.onLoad();
        this.aroundTablePlayerComponents =
            this.node.getComponentsInChildren(AroundTablePlayerComponent).filter((component) => component && component.node.active) ?? [];
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.aroundTablePlayer)
    renderAroundTablePlayer(aroundTablePlayer: IAroundTablePlayers) {
        aroundTablePlayer && this.addNewPlayer(aroundTablePlayer);
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.aroundTablePlayers)
    renderAroundTablePlayers(aroundTablePlayers: gc.GameServiceMessage.AroundTablePlayers) {
        if (aroundTablePlayers) {
            const players: IAroundTablePlayers[] = Object.values(aroundTablePlayers);
            // Real player is type equal false
            const sortedPlayers: IAroundTablePlayers[] = players.sort((playerA, playerB) => (playerA.type === false ? -1 : 1));

            sortedPlayers.forEach((player) => {
                this.addNewPlayer(player);
            });
        }
    }

    protected addNewPlayer(aroundTablePlayer: IAroundTablePlayers) {
        const playerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayerComponents, aroundTablePlayer.id);
        const playerFromCache = AroundTablePlayerUtils.getPlayerFromCache(aroundTablePlayer.id);
        aroundTablePlayer.idleCount = playerFromCache ? playerFromCache.idleCount : 0;

        if (!playerSlot) {
            const emptySlot = AroundTablePlayerUtils.getEmptyPlayerSlot(this.aroundTablePlayerComponents);

            if (emptySlot && aroundTablePlayer.idleCount <= AroundTablePlayerComponent.maxIdleCount) {
                AroundTablePlayerUtils.addAroundTablePlayerInfo({
                    playerComp: emptySlot,
                    value: aroundTablePlayer,
                });

                return;
            }

            aroundTablePlayer?.id && (this.hiddenPlayers[aroundTablePlayer.id] = aroundTablePlayer);
        }
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.outGamePlayerId)
    handleRemoveAroundTablePlayer(outGamePlayerId: string) {
        if (!outGamePlayerId) {
            return;
        }

        const playerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayerComponents, outGamePlayerId);

        if (playerSlot) {
            AroundTablePlayerUtils.addAroundTablePlayerInfo({
                playerComp: playerSlot,
                value: null,
            });
            const playerIds = Object.keys(this.hiddenPlayers);

            if (playerIds.length > 0) {
                const newPlayerId = playerIds[0];
                const newPlayer = this.hiddenPlayers[newPlayerId];
                this.addNewPlayer(newPlayer);
                delete this.hiddenPlayers[newPlayerId];
            }
        } else {
            delete this.hiddenPlayers[outGamePlayerId];
        }
    }

    @render(Rounds.RoundTimeStore, (store) => ({ roundTime: store.roundTime, lockingBet: store.lockingBet }))
    calculateDelayFlyChip({ roundTime, lockingBet }: { roundTime: number; lockingBet: number }) {
        if (roundTime >= lockingBet + 2) {
            this.isFlyChipSlow = true;
        } else {
            this.isFlyChipSlow = false;
        }
    }

    @render(AroundTablePlayersChipStore, (store) => store.aroundTablePlayerChip, { fireImmediately: false })
    handleAroundTablePlayerPlaceChip(aroundTablePlayerPlaceChip: IAroundTablePlayerChip) {
        const { playerChip, chipValues } = aroundTablePlayerPlaceChip ?? {};
        if (!playerChip) {
            return;
        }

        const { betChoice, playerId } = playerChip;
        let startNode: Node;
        let isHiddenPlayer = false;
        const aroundTablePlayer = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayerComponents, playerId);
        const betItem: BetItem = AroundTablePlayerUtils.getBetItem(this.betItems.betItemComponents, betChoice);

        if (aroundTablePlayer) {
            AroundTablePlayerUtils.updatePlayerSlotDataStorage(playerChip, aroundTablePlayer);
            startNode = aroundTablePlayer.avatar.node;
        } else {
            startNode = this.hiddenPlayersNode;
            isHiddenPlayer = true;
            this.updateHiddenPlayerStorage(playerChip);
        }

        const aroundTablePlayerInfo = {
            chipValues,
            chipBox: betItem?.chipBox,
            startNode,
            isHiddenPlayer,
        };

        if (!this.node.activeInHierarchy) {
            this.placeAroundTablePlayerChip(aroundTablePlayerInfo);
        } else {
            const delayTime = this.calculateDelayTime();
            this.delayedPlaceChip(aroundTablePlayerInfo, delayTime);
        }
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

    protected placeAroundTablePlayerChip(visiblePlayerPlaceChip: IAroundTablePlayerPlaceChip) {
        const { chipValues, chipBox, startNode, isHiddenPlayer } = visiblePlayerPlaceChip ?? {};
        if (chipValues) {
            Object.keys(chipValues).forEach((chipValue) => {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    const ownerChip = {
                        chipBox,
                        chipValue: +chipValue,
                    };
                    placeChipToChipBox(this.slidingChip, ownerChip, startNode, null, isHiddenPlayer);
                }
            });

            this.aroundTablePlayerChip.pop();
        }
    }

    protected calculateDelayTime() {
        let delayTime = this.aroundTablePlayerChip.length * 0.01;
        if (this.isFlyChipSlow) {
            delayTime = this.aroundTablePlayerChip.length * 0.07;
        }
        return delayTime > 1 ? delayTime / 2 : delayTime;
    }

    protected delayedPlaceChip(aroundTablePlayerInfo: IAroundTablePlayerPlaceChip, delayTime: number) {
        tween(this.node)
            .delay(delayTime)
            .call(() => {
                this.placeAroundTablePlayerChip(aroundTablePlayerInfo);
            })
            .start();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    renderAroundTablePlayerWhenStartBet(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.figureOutAroundTablePlayers();
    }

    protected async figureOutAroundTablePlayers() {
        const hiddenPlayers: IAroundTablePlayers[] = values(this.hiddenPlayers);
        for (const player of this.aroundTablePlayerComponents) {
            const aroundTablePlayer = player.aroundTablePlayer;

            if (!aroundTablePlayer) {
                return;
            }

            aroundTablePlayer.idleCount++;
            AroundTablePlayerUtils.storePlayerToCache(aroundTablePlayer);

            if (AroundTablePlayerUtils.isIdle(player)) {
                await this.handleIdleAroundTablePlayer(player, aroundTablePlayer, hiddenPlayers);
            }
        }

        const botAroundTablePlayerPlayerComps = AroundTablePlayerUtils.getBotAroundTablePlayerComps(this.aroundTablePlayerComponents);
        const realPlayers = AroundTablePlayerUtils.getRealPlayer(hiddenPlayers);

        for (const botAroundTablePlayer of botAroundTablePlayerPlayerComps) {
            const aroundTablePlayer = botAroundTablePlayer.aroundTablePlayer;
            const realPlayer = AroundTablePlayerUtils.findIdleRealPlayer(realPlayers);
            if (realPlayer) {
                await this.updateAroundTablePlayerInfoAndSwap(aroundTablePlayer, realPlayer, botAroundTablePlayer);
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
            AroundTablePlayerUtils.addAroundTablePlayerInfo({
                playerComp: aroundTablePlayerComp,
                value: newPlayer,
            });
            delete this.hiddenPlayers[newPlayer.id];
            this.hiddenPlayers[oldPlayerData.id] = oldPlayerData;
            remove(hiddenPlayers, newPlayer);
        }
    }

    protected async updateAroundTablePlayerInfoAndSwap(
        aroundTablePlayer: IAroundTablePlayers,
        realPlayer: IAroundTablePlayers,
        botAroundTablePlayer: AroundTablePlayerComponent
    ) {
        this.hiddenPlayers[aroundTablePlayer.id] = aroundTablePlayer;
        AroundTablePlayerUtils.addAroundTablePlayerInfo({
            playerComp: botAroundTablePlayer,
            value: realPlayer,
        });
    }
}
