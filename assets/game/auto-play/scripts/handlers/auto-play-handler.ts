import gc from "@sg/game-client-base";
import inversify from "inversify";

import { AutoPlayStore } from "../stores/auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore;

    handle() {}

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.noOfRounds = rounds;
    }
}
