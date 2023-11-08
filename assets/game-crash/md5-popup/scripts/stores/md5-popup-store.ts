import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { CrashRoundHistory } from "../../../statistics-bar/statistics-bar";

const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class Md5PopupStore {
    private _isCrashed: {
        value: boolean;
    } = null;

    private _isOpenPopupMd5: boolean = false;

    private _data: CrashRoundHistory = null;

    private _isPopupCurrRound = false;

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

    get roundHistoryData() {
        return this._data;
    }

    set roundHistoryData(data: CrashRoundHistory) {
        this._data = data;
    }

    get isCurrRound() {
        return this._isPopupCurrRound;
    }

    set isCurrRound(isCurrentRound: boolean) {
        this._isPopupCurrRound = isCurrentRound;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
