import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class StatusCurrentRoundStore {
    private _isCurrentRound: boolean = false;

    get isCurrentRound() {
        return this._isCurrentRound;
    }

    set isCurrentRound(value: boolean) {
        this._isCurrentRound = value;
    }
    constructor() {
        mobx.makeAutoObservable(this);
    }
}
