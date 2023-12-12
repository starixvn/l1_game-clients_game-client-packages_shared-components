import gc from "@sg/game-client-base";
import inversify from "inversify";
import { IHandler } from "observer";

import { PlayerActionStore } from "./player-action-store";

const { injectable, inject } = inversify;

@injectable()
export class PlayerActionHandlers implements IHandler<boolean> {
    @inject(PlayerActionStore)
    protected readonly playerActionStore: PlayerActionStore;

    @inject(gc.Bet.BetStore)
    protected readonly betStore: gc.Bet.BetStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    handle(flag: boolean) {}

    handleEndShowCashOutNotice(flag: boolean) {
        this.playerActionStore.endShowCashOutNotice = flag;
    }

    handleCurrentBetStateInStore(action: string) {
        this.playerActionStore.betState = action;
    }

    handleCurrentEarlyBetStateInStore(action: string) {
        this.playerActionStore.earlyBetState = action;
    }

    handleWaitingBet(flag: boolean) {
        this.playerActionStore.waitingBet = flag;
    }

    handleCurrentCashOutStateInStore(action: string) {
        this.playerActionStore.cashOutState = action;
    }

    handleActiveAutoPlayInStore(flag: boolean) {
        this.playerActionStore.activeAutoPlay = flag;
    }

    handleEnableAutoPlayInStore(flag: boolean) {
        this.playerActionStore.enableAutoPlay = flag;
    }
}
