import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class Md5PopupStore {
    private _isCrashed: {
        value: number;
    } = null;

    private _isOpenPopupMd5: boolean = false;

    get isCrashedGame() {
        return this._isCrashed;
    }

    set isCrashedGame(isCrash: any) {
        this._isCrashed = { value: isCrash };
    }

    get isOpenPopupMd5() {
        return this._isOpenPopupMd5;
    }

    set isOpenPopupMd5(isOpen: boolean) {
        this._isOpenPopupMd5 = isOpen;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
