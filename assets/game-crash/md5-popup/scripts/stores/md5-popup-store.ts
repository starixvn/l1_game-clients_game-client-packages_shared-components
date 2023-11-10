import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
import { CrashRoundHistory } from "../../../crash-round-history/crash-round-history-store";

const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@injectable()
export class Md5PopupStore {
    private _isOpenPopupMd5: boolean = false;

    private _data: CrashRoundHistory = null;

    private _roundId = 0;

    private _index = 0;

    get isOpenPopupMd5() {
        return this._isOpenPopupMd5;
    }

    set isOpenPopupMd5(isOpen: boolean) {
        this._isOpenPopupMd5 = isOpen;
    }

    get roundId() {
        return this._roundId;
    }

    set roundId(roundId: number) {
        this._roundId = roundId;
    }

    get indexRound() {
        return this._index;
    }

    set indexRound(index: number) {
        this._index = index;
    }

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
