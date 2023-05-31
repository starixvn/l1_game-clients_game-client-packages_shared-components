import { _decorator, Node, tween } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import * as actions from "../../.././sliding-chip/scripts/components/actions";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { BetItemStore, IOwnChip, IPlayersChips } from "../../../bets/scripts/stores/bet-item-store";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { ChipFlyingHandlers } from "../handlers/chip-flying-handler";
import { ChipFlyingStore, TPayChipInfo } from "../stores/chip-flying.store";
import { ActionChipFlying } from "./actions";

const { Auth } = gc;
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

    @render(BetItemStore, (store) => store.playersChips)
    flyChipJoinGame(ownChips: IPlayersChips[]) {
        ownChips.forEach((ownChip) => {
            actions.addChipsToChipBoxWhenJoinRoom(ownChip);
        });
    }

    @render(BetItemStore, (store) => store.ownChip)
    flyChip(ownChip: IOwnChip) {
        actions.placeChipToChipBox(ownChip, null, null);
    }

    @render(ChipFlyingStore, (store) => store.payChipInfo)
    payChips(payChipInfo: TPayChipInfo) {
        if (payChipInfo?.isFinishedShowResult) {
            const { finish, betInfo } = payChipInfo;

            if (!this || !finish?.settlementResult || !this.enablePlaceChips || !this.node) {
                return;
            }

            if (!this.node.activeInHierarchy) {
                ActionChipFlying.dealerGetChips(payChipInfo, betInfo?.lostBetItems);
                ActionChipFlying.dealerPayChips(payChipInfo, betInfo?.winBetItems);
                this.isChipStack && ActionChipFlying.removeChipStack(betInfo?.winBetItems);
                this.payChipToAllPlayers(payChipInfo);
            } else {
                tween(this.node)
                    .delay(this.chipDelayFlyingTime)
                    .call(() => {
                        ActionChipFlying.dealerGetChips(payChipInfo, betInfo?.lostBetItems);
                    })
                    .delay(this.chipDelayFlyingTime)
                    .call(() => {
                        ActionChipFlying.dealerPayChips(payChipInfo, betInfo?.winBetItems);
                    })
                    .delay(this.chipDelayFlyingTime)
                    .call(() => {
                        this.isChipStack && ActionChipFlying.removeChipStack(betInfo?.winBetItems);
                        this.payChipToAllPlayers(payChipInfo);
                    })
                    .start();
            }
        }
    }

    payChipToAllPlayers = (payChipInfo: TPayChipInfo) => {
        const { hiddenPlayersNode: otherPlayers, settleStatus } = payChipInfo;

        ActionChipFlying.payChipsToMainPlayer(payChipInfo);
        this.showPayoutForLoginPlayer(settleStatus);

        if (otherPlayers) {
            ActionChipFlying.payChipsToHiddenPlayers(payChipInfo);
        }

        ActionChipFlying.payChipsToAroundTablePlayers(payChipInfo);
    };

    showPayoutForLoginPlayer(settleStatus: gc.Settlements.SettlementStatusStore) {
        if (settleStatus?.win) {
            this.updateBalance(settleStatus?.bet);
            this.playWinningEffect();
            this.getBalance();
        }
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.UpdateBalanceWhenPayout)
    updateBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.PlayWinningEffect)
    playWinningEffect() {
        return true;
    }
}
