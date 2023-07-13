import { Node } from "cc";
import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export interface IBetDetailLog {}

@injectable()
export class BetDetailStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    data: Array<IBetDetailLog> = [];

    setData(data: Array<IBetDetailLog>) {
        this.data = data;
    }
}
