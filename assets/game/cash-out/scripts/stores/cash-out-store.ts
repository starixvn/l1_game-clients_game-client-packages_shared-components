import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class CashOutStore {
    public isCashOutFull = true;
    public isCashOutHalf = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
