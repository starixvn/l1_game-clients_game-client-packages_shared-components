import { Node } from "cc";
import gc from "game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import BetItem from "../../../bets/scripts/components/bet-item";
import { BetItemStore } from "../../../bets/scripts/stores/bet-item-store";
import { AroundTablePlayerComponent } from "../../../games/around-table-player/scripts/components/around-table-player-component";
import { AroundTablePlayersStore } from "../../../games/around-table-player/scripts/stores/around-table-players-store";
import { MainPlayerProfileStore } from "../../../main-player-profile/scripts/stores/main-player-profile-store";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { SlidingChipStore } from "../../../sliding-chip/scripts/stores/sliding-chip-store";
import { ChipFlying } from "../components/chip-flying";
import { HiddenPlayersStore } from "./hidden-players-store";
const { injectable, inject } = inversify;

export type TPayChipInfo = {
    betInfo: {
        winBetItems: BetItem[];
        lostBetItems: BetItem[];
    };
    settleStatus: gc.Settlements.SettlementStatusStore;
    mainPlayerAvatarNode: Node;
    slidingChip: SlidingChip;
    finish: {
        settlementResult: gc.GameServiceMessage.TSettlementResult;
        winningPlayers: gc.GameServiceMessage.TWinningPlayers;
    };
    hiddenPlayersNode: Node;
    chipFlyingTime: number;
    isChipStack: boolean;
    payChipsDuration: number;
    dealerChipBox: Node;
    aroundTablePlayerComponents: AroundTablePlayerComponent[];
    isFinishedShowResult: boolean;
};
@injectable()
export class ChipFlyingStore {
    @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;
    @inject(BetItemStore) private readonly betItemStore: BetItemStore;
    @inject(gc.Settlements.SettlementStatusStore) private readonly settlementStatusStore: gc.Settlements.SettlementStatusStore;
    @inject(gc.Settlements.SettlementStore) private readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;
    @inject(AroundTablePlayersStore) private readonly aroundTablePlayersStore: AroundTablePlayersStore;
    @inject(HiddenPlayersStore) private readonly hiddenPlayersStore: HiddenPlayersStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _boxChip: Node = null;
    private _chipFlying: ChipFlying = null;
    playerSlot: any[] = [];

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
                mainPlayerAvatarNode: this.mainPlayerProfileStore.mainPlayerAvatarNode,
                slidingChip: this.slidingChipStore.slidingChip,
                hiddenPlayersNode: this.hiddenPlayersStore.hiddenPlayersNode,
                chipFlyingTime: this.slidingChipStore.slidingChip.chipFlyingTime,
                isChipStack: this.chipFlying.isChipStack,
                payChipsDuration: this.chipFlying.payChipsDuration,
                dealerChipBox: this.chipFlying.dealerChipBox,
                aroundTablePlayerComponents: this.aroundTablePlayersStore.aroundTablePlayerComponents,
                isFinishedShowResult: this.settlementStore.isFinishedShowResult,
            };
        }

        return null;
    }
}
