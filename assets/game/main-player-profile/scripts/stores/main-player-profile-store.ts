import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;

export type TEndBetInfo = {
    bet: number;
};

@injectable()
export class MainPlayerProfileStore {
    private _mainPlayerAvatarNode: Node = null;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get mainPlayerAvatarNode() {
        return this._mainPlayerAvatarNode;
    }

    set mainPlayerAvatarNode(ownerAvatar: Node) {
        this._mainPlayerAvatarNode = ownerAvatar;
    }
}
