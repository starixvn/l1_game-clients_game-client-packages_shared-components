import gc from "@sg/game-client-base";
import inversify from "inversify";
import { IHandler } from "observer";

import { BetInputStore } from "../../../../../extensions/shared-components/assets/game-crash/bet-input/scripts/stores/bet-input-store";
import { EarlyBetStore } from "./early-bet-store";

const { injectable, inject } = inversify;

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    @inject(gc.Notices.NoticeStore)
    protected readonly noticeStore: gc.Notices.NoticeStore;
    @inject(gc.Player.MainPlayerStore)
    protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore;

    @inject(BetInputStore) private readonly betInputStore: BetInputStore;

    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;

    handle(enable: boolean) {
        this.earlyBetStore.betAmount = this.betInputStore.betAmount;
        this.validateBalance(enable);
    }

    validateBalance(enable: boolean) {
        const { freebetEnabled } = this.betStore;
        const availableBalance = freebetEnabled ? this.mainPlayerStore.scoin : this.mainPlayerStore.balance;
        if (this.earlyBetStore.betAmount > availableBalance && enable) {
            const message = freebetEnabled
                ? gc.Translator.commonTranslate("not_enough_scoin")
                : gc.Translator.commonTranslate("not_enough_money");
            this.noticeStore.addWarning(message);
        } else {
            this.earlyBetStore.earlyBet = enable;
        }
    }
}
