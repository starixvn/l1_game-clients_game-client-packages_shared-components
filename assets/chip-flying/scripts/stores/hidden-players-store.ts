import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;

@injectable()
export class HiddenPlayersStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _hiddenPlayersNode: Node = null;

    get hiddenPlayersNode() {
        return this._hiddenPlayersNode;
    }

    set hiddenPlayersNode(hiddenPlayers: Node) {
        this._hiddenPlayersNode = hiddenPlayers;
    }
}
