import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class PopupsGameStore {
    private _enabledOverlay = false;
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get enabledOverlay(): boolean {
        return this._enabledOverlay;
    }

    set enabledOverlay(value: boolean) {
        this._enabledOverlay = value;
    }
}
