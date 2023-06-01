import { Node } from "cc";
import inversify from "inversify";
import { HiddenPlayersStore } from "../stores/hidden-players-store";

const { injectable, inject } = inversify;

export namespace HiddenPlayersHandlers {
    @injectable()
    export class SetHiddenPlayers {
        @inject(HiddenPlayersStore) private readonly hiddenPlayersStore: HiddenPlayersStore;

        async handle(hiddenPlayers: Node) {
            this.hiddenPlayersStore.hiddenPlayersNode = hiddenPlayers;
        }
    }
}
