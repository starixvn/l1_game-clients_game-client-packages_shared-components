import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;

export type TEndBetInfo = {
    bet: number;
};

@injectable()
export class UserProfileStore {
    private _ownerAvatar: Node = null;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get ownerAvatar() {
        return this._ownerAvatar;
    }

    set ownerAvatar(ownerAvatar: Node) {
        this._ownerAvatar = ownerAvatar;
    }
}
