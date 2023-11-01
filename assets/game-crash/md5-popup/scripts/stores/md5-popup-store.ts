import { _decorator } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { ccclass, property } = _decorator;
const { injectable, inject } = inversify;

@ccclass
export class Md5PopupStore {
    private _multiplier = 1;
    private _roundId = 0;
    constructor() {
        mobx.makeAutoObservable(this);
    }
}
