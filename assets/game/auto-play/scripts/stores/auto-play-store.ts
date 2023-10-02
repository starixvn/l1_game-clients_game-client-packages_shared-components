import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class AutoPlayStore {
    public isOpenAutoPlayPopup = false;
    public noOfRounds = 0;
    public isShowIconAutoPlay = true;
    public isShowNoOfRound = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
