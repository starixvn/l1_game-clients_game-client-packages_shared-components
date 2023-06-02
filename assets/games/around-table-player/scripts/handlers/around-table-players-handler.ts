import gc from "game-client-base";
import inversify from "inversify";

import { AroundTablePlayerComponent } from "../components/around-table-player-component";
import { AroundTablePlayersStore } from "../stores/around-table-players-store";

const { injectable, inject } = inversify;

export namespace AroundTablePlayersHandlers {
    @injectable()
    export class SetPlayerComponent {
        @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;

        async handle(playerComponent: AroundTablePlayerComponent) {
            this.aroundTablePlayersStore.setPlayersComp(playerComponent);
        }
    }

    @injectable()
    export class AddAroundTablePlayer {
        @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;

        async handle(aroundTablePlayer: gc.GameServiceMessage.AroundTablePlayer) {
            this.aroundTablePlayersStore.addPlayer(aroundTablePlayer);
        }
    }

    @injectable()
    export class AddAroundTablePlayers {
        @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;

        async handle(aroundTablePlayers: gc.GameServiceMessage.AroundTablePlayers) {
            this.aroundTablePlayersStore.addPlayers(aroundTablePlayers);
        }
    }

    @injectable()
    export class RemoveAroundTablePlayer {
        @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;

        async handle(aroundTablePlayerIdOutGame: string) {
            this.aroundTablePlayersStore.removePlayer(aroundTablePlayerIdOutGame);
        }
    }

    @injectable()
    export class FigureOutVisiblePlayers {
        @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;

        async handle() {
            await this.aroundTablePlayersStore.figureOutAroundTablePlayers();
        }
    }
}
