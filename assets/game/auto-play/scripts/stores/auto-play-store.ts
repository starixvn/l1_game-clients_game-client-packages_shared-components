import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class AutoPlayStore {
    public roundsList = [10, 30, 50, 80, 100, 200, 500, 1000];
    public isOpenAutoPlayPopup = false;
    public selectedRoundOnPopup = this.roundsList[0];
    public autoPlayRounds = 0;

    public isAutoPlay = false;

    constructor() {
        mobx.makeAutoObservable(this);
    }
}
