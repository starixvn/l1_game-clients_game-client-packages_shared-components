import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import BetItem from "../../../bets/scripts/components/bet-item";
import { BetItemStore } from "../../../bets/scripts/stores/bet-item-store";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
import { UserProfileStore } from "../../../user-profile/scripts/stores/user-profile-store";
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
        settlementResult: gc.GameServiceMessage.TSettlementResult;
        winningPlayers: gc.GameServiceMessage.TWinningPlayers;
    };
    otherPlayers: Node;
    chipFlyingTime: number;
    winningDuration: number;
    isChipStack: boolean;
    payChipsDuration: number;
    dealerChipBox: Node;
    playerSlot: any[];
    isFinishedShowResult: boolean;
};
@injectable()
export class ChipFlyingStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(BetItemStore) private readonly betItemStore: BetItemStore;
    @inject(gc.Settlements.SettlementStatusStore) private readonly settlementStatusStore: gc.Settlements.SettlementStatusStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(UserProfileStore) private readonly userProfileStore: UserProfileStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _otherPlayer: Node = null;
    private _boxChip: Node = null;
    private _chipFlying: ChipFlying = null;
    playerSlot: any[] = [];

    get otherPlayers() {
        return this._otherPlayer;
    }

    set otherPlayers(otherPlayers: Node) {
        this._otherPlayer = otherPlayers;
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

    get payChipInfo(): TPayChipInfo {
        if (this.settlementStore.isFinishedShowResult) {
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
                ownerAvatar: this.userProfileStore.ownerAvatar,
                slidingChip: this.slidingChipStore.slidingChip,
                otherPlayers: this.otherPlayers,
                chipFlyingTime: this.slidingChipStore.slidingChip.chipFlyingTime,
                winningDuration: this.chipFlying.winningDuration,
                isChipStack: this.chipFlying.isChipStack,
                payChipsDuration: this.chipFlying.payChipsDuration,
                dealerChipBox: this.chipFlying.dealerChipBox,
                playerSlot: this.playerSlot,
                isFinishedShowResult: this.settlementStore.isFinishedShowResult,
            };
        }

        return null;
    }
}
