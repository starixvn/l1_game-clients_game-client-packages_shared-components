import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import BetItem from "../../../bets/scripts/components/bet-item";
import { BetItemStore } from "../../../bets/scripts/stores/bet-item-store";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
import { ChipFlying } from "../components/chip-flying";
const { injectable, inject } = inversify;

export type TPayChipInfo = {
    betInfo: {
        winBetItems: BetItem[];
        lostBetItems: BetItem[];
    };
    settleStatus: gc.Settlements.SettlementStatusStore;
    ownerAvatar: Node;
    slidingChip: SlidingChip;
    finish: {
        settlementResult: gc.GameServiceMessage.TResult;
        winningPlayers: gc.GameServiceMessage.TWinningPlayers;
    };
    otherUsers: Node;
    chipFlyingTime: number;
    chipDelayFlyingTime: number;
    winningDuration: number;
    isChipStack: boolean;
    payChipsDuration: number;
    dealerChipBox: Node;
    playerSlot: any[];
    isShowResult: boolean;
    otherPlayers?: any;
};
@injectable()
export class ChipFlyingStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(BetItemStore) private readonly betItemStore: BetItemStore;
    @inject(gc.Settlements.SettlementStatusStore) private readonly settlementStatusStore: gc.Settlements.SettlementStatusStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Rounds.RoundTimeStore) private readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _otherUsers: Node = null;
    private _boxChip: Node = null;
    private _ownerAvatar: Node = null;
    private _chipFlying: ChipFlying = null;
    playerSlot: any[] = [];

    get otherUsers() {
        return this._otherUsers;
    }

    set otherUsers(otherUsers: Node) {
        this._otherUsers = otherUsers;
    }

    get chipFlying() {
        return this._chipFlying;
    }

    set chipFlying(chipFlying: ChipFlying) {
        this._chipFlying = chipFlying;
    }

    get boxChip() {
        return this._boxChip;
    }

    set boxChip(boxChip: Node) {
        this._boxChip = boxChip;
    }

    get ownerAvatar() {
        return this._ownerAvatar;
    }

    set ownerAvatar(ownerUser: Node) {
        this._ownerAvatar = ownerUser;
    }

    get payChipInfo(): TPayChipInfo {
        if (this.roundTimeStore.isShowResult) {
            const betInfo = {
                winBetItems: this.betItemStore.winBetItems,
                lostBetItems: this.betItemStore.lostBetItems,
            };

            const finish = {
                settlementResult: this.settlementStore.settlementResult,
                winningPlayers: this.settlementStore.winningPlayers,
            };

            return {
                betInfo,
                finish,
                settleStatus: this.settlementStatusStore,
                ownerAvatar: this.ownerAvatar,
                slidingChip: this.slidingChipStore.slidingChip,
                otherUsers: this.otherUsers,
                chipFlyingTime: this.chipFlying.payChipsDuration,
                chipDelayFlyingTime: this.chipFlying.chipDelayFlyingTime,
                winningDuration: this.chipFlying.winningDuration,
                isChipStack: this.chipFlying.isChipStack,
                payChipsDuration: this.chipFlying.payChipsDuration,
                dealerChipBox: this.chipFlying.dealerChipBox,
                playerSlot: this.playerSlot,
                isShowResult: this.roundTimeStore.isShowResult,
            };
        }
        return null;
    }
}
