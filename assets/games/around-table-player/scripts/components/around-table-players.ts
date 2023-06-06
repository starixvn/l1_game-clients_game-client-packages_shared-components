import { _decorator, tween } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { ObserverComponent } from "../../../../common/observer-component/scripts/observer-component";
import { placeChipToChipBox } from "../../../../sliding-chip/scripts/components/actions";
import { AroundTablePlayersHandlers } from "../handlers/around-table-players-handler";
import { AroundTablePlayersStore, IAroundTablePlayerPlaceChip, INewPlayerInfo } from "../stores/around-table-players-store";

const { ccclass } = _decorator;

const { Player, Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class AroundTablePlayers extends ObserverComponent {
    protected aroundTablePlayerChip = [];
    protected isFlyChipSlow = true;

    @render(Player.AroundTablePlayersStore, (store) => store.aroundTablePlayer)
    renderAroundTablePlayer(aroundTablePlayer: gc.GameServiceMessage.AroundTablePlayer) {
        aroundTablePlayer && this.addAroundTablePlayer(aroundTablePlayer);
    }

    @handle(AroundTablePlayersHandlers.AddAroundTablePlayer)
    addAroundTablePlayer(aroundTablePlayer: gc.GameServiceMessage.AroundTablePlayer) {
        return aroundTablePlayer;
    }

    @render(Player.AroundTablePlayersStore, (store) => store.aroundTablePlayers)
    renderAroundTablePlayers(aroundTablePlayers: gc.GameServiceMessage.AroundTablePlayers) {
        aroundTablePlayers && this.addAroundTablePlayers(aroundTablePlayers);
    }

    @handle(AroundTablePlayersHandlers.AddAroundTablePlayers)
    addAroundTablePlayers(aroundTablePlayers: gc.GameServiceMessage.AroundTablePlayers) {
        return aroundTablePlayers;
    }

    @render(Player.AroundTablePlayersStore, (store) => store.aroundTablePlayerIdOutGame)
    handleRemoveAroundTablePlayer(aroundTablePlayerIdOutGame: string) {
        this.removeAroundTablePlayer(aroundTablePlayerIdOutGame);
    }

    @handle(AroundTablePlayersHandlers.RemoveAroundTablePlayer)
    removeAroundTablePlayer(aroundTablePlayerIdOutGame: string) {
        return aroundTablePlayerIdOutGame;
    }

    @render(AroundTablePlayersStore, (store) => store.newPlayerInfo)
    addAroundTablePlayerInfo(newPlayerInfo: INewPlayerInfo) {
        const { value } = newPlayerInfo ?? {};
        let clonePlayerInfo = null;
        if (value) {
            const { id, name, red, avatarId, type, idleCount = 0 } = value;
            clonePlayerInfo = {
                id,
                name,
                red,
                avatarId,
                type,
                idleCount,
            };
        }

        newPlayerInfo?.playerComp.setInfo(clonePlayerInfo).catch(() => {
            console.log("Error setInfo");
        });
    }

    @render(Rounds.RoundTimeStore, (store) => ({ roundTime: store.roundTime, lockingBet: store.lockingBet }))
    calculateDelayFlyChip({ roundTime, lockingBet }: { roundTime: number; lockingBet: number }) {
        if (roundTime >= lockingBet + 2) {
            this.isFlyChipSlow = true;
        } else {
            this.isFlyChipSlow = false;
        }
    }

    @render(AroundTablePlayersStore, (store) => store.aroundTablePlayerPlaceChip, { fireImmediately: false })
    handleAroundTablePlayerPlaceChip(aroundTablePlayerPlaceChip: IAroundTablePlayerPlaceChip) {
        const { playerChip } = aroundTablePlayerPlaceChip ?? {};
        if (playerChip) {
            this.aroundTablePlayerChip.push(playerChip);
            if (!this.node.activeInHierarchy) {
                this.placeAroundTablePlayerChip(aroundTablePlayerPlaceChip);
            } else {
                let delayTime = this.aroundTablePlayerChip.length * 0.01;
                if (this.isFlyChipSlow) {
                    delayTime = this.aroundTablePlayerChip.length * 0.07;
                }

                tween(this.node)
                    .delay(delayTime > 1 ? delayTime / 2 : delayTime)
                    .call(() => {
                        this.placeAroundTablePlayerChip(aroundTablePlayerPlaceChip);
                    })
                    .start();
            }
        }
    }

    placeAroundTablePlayerChip(visiblePlayerPlaceChip: IAroundTablePlayerPlaceChip) {
        const { chipValues, chipBox, slidingChip, startNode } = visiblePlayerPlaceChip ?? {};
        if (chipValues) {
            Object.keys(chipValues).forEach((chipValue) => {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    const ownerChip = {
                        chipBox,
                        chipAmount: +chipValue,
                        slidingChip,
                    };
                    placeChipToChipBox(ownerChip, startNode, null);
                }
            });

            this.aroundTablePlayerChip.pop();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    renderAroundTablePlayerWhenStartBet(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.figureOutAroundTablePlayers();
    }

    @handle(AroundTablePlayersHandlers.FigureOutVisiblePlayers)
    figureOutAroundTablePlayers() {}
}
