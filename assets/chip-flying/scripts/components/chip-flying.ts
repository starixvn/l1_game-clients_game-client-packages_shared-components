import { _decorator, Node, tween } from "cc";
import Observer from "observer";
import * as actions from "../../.././sliding-chip/scripts/components/actions";
import { BetItemStore, IOwnChip, IOwnChips } from "../../../bets/scripts/stores/bet-item-store";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { ChipFlyingHandlers } from "../handlers/chip-flying-handler";
import { ChipFlyingStore, TPayChipInfo } from "../stores/chip-flying.store";
import { ActionChipFlying } from "./actions";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class ChipFlying extends ObserverComponent {
    @property(Node)
    dealerChipBox: Node = null;

    onLoad() {
        super.onLoad();
        this.setDealerChipBox();
        this.setChipFlying();
    }
    protected enablePlaceChips = true;
    public winningDuration = 3;
    public isChipStack = false;
    public payChipsDuration = 1.2;
    public chipDelayFlyingTime = 1.25;

    @handle(ChipFlyingHandlers.SetDealerChipBox)
    setDealerChipBox() {
        return this.dealerChipBox;
    }
    @handle(ChipFlyingHandlers.SetChipFlying)
    setChipFlying() {
        return this;
    }

    @render(BetItemStore, (store) => store.ownChips)
    flyChipJoinGame(ownChips: IOwnChips[]) {
        ownChips.forEach((ownChip) => {
            actions.addChipsToChipBoxWhenJoinRoom(1, ownChip);
        });
    }

    @render(BetItemStore, (store) => store.ownChip)
    flyChip(ownChip: IOwnChip) {
        actions.placeChipToChipBox(ownChip, null, null);
    }

    @render(ChipFlyingStore, (store) => store.payChipInfo)
    payChips(payChipInfo: TPayChipInfo) {
        if (payChipInfo?.isShowResult) {
            const { finish, betInfo, slidingChip } = payChipInfo;

            if (!this || !finish?.settlementResult || !this.enablePlaceChips || !this.node) {
                return;
            }

            if (!this.node.activeInHierarchy) {
                ActionChipFlying.dealerGetChips(payChipInfo, betInfo?.lostBetItems);
                ActionChipFlying.dealerPayChips(payChipInfo, betInfo?.winBetItems);
                this.isChipStack && ActionChipFlying.removeChipStack(betInfo?.winBetItems);
                ActionChipFlying.payChipToAllPlayers(payChipInfo);
            } else {
                tween(this.node)
                    .delay(slidingChip.chipDelayFlyingTime)
                    .call(() => {
                        ActionChipFlying.dealerGetChips(payChipInfo, betInfo?.lostBetItems);
                    })
                    .delay(slidingChip.chipDelayFlyingTime)
                    .call(() => {
                        ActionChipFlying.dealerPayChips(payChipInfo, betInfo?.winBetItems);
                    })
                    .delay(slidingChip.chipDelayFlyingTime)
                    .call(() => {
                        this.isChipStack && ActionChipFlying.removeChipStack(betInfo?.winBetItems);
                        ActionChipFlying.payChipToAllPlayers(payChipInfo);
                    })
                    .start();
            }
        }
    }
}
