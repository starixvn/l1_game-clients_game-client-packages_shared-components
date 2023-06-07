import { _decorator, Node, tween } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import * as actions from "../../.././sliding-chip/scripts/components/actions";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { TBalanceEffect, TWinningEffect } from "../../../balance-effect/scripts/stores/balance-effect-store";
import { BetItemStore, IOwnChip, IPlayersChips } from "../../../bets/scripts/stores/bet-item-store";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { AroundTablePlayerUtils } from "../../../games/around-table-player/scripts/utils";
import { NumberUtils } from "../../../utils";
import { ChipFlyingHandlers } from "../handlers/chip-flying-handler";
import { ChipFlyingStore, TPayChipInfo } from "../stores/chip-flying-store";
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
        this.showPayoutForMainPlayer(settleStatus);

        if (otherPlayers) {
            ActionChipFlying.payChipsToHiddenPlayers(payChipInfo);
        }

        this.payChipsToAroundTablePlayers(payChipInfo);
    };

    showPayoutForMainPlayer(settleStatus: gc.Settlements.SettlementStatusStore) {
        if (settleStatus?.win) {
            this.updateBalance(settleStatus?.bet);
            this.playWinningEffectMainPlayer();
            this.getBalance();
        }
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.UpdatePayoutBalanceMainPlayer)
    updateBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.UpdateWinEffectMainPlayer)
    playWinningEffectMainPlayer() {
        return true;
    }

    payChipsToAroundTablePlayers(payChipInfo: TPayChipInfo) {
        const {
            finish,
            betInfo,
            slidingChip,
            payChipsDuration,
            isChipStack,
            aroundTablePlayerComponents,
        } = payChipInfo;
        const winningPlayers = finish.winningPlayers;

        if (!winningPlayers) {
            return;
        }

        const winningPlayerIds = Object.keys(winningPlayers);
        const winningEffects: TWinningEffect[] = [];
        const balanceEffects: TBalanceEffect[] = [];

        winningPlayerIds.forEach((playerId) => {
            const aroundTablePlayerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(aroundTablePlayerComponents, playerId);
            if (!aroundTablePlayerSlot) {
                return;
            }

            const winningPlayerData = winningPlayers[playerId];
            const playerBetItems = winningPlayerData.winningByChoices;
            const { bet, rate } = winningPlayerData;

            betInfo?.winBetItems.forEach((item) => {
                if (playerBetItems && playerBetItems[item.betChoice] > 0) {
                    const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                    chipNode && slidingChip.moveChipsWithRandomAmount(chipNode, aroundTablePlayerSlot.avatar.node, payChipsDuration);
                }
            });

            const convertValue = NumberUtils.getValueByCurrency(bet, rate || 1);
            aroundTablePlayerSlot.increaseBalance(convertValue);
            winningEffects.push({ avatarNode: aroundTablePlayerSlot.node, status: true });
            balanceEffects.push({ avatarNode: aroundTablePlayerSlot.node, balance: convertValue });
        });

        this.showWinningEffectAroundTablePlayers(winningEffects);
        this.showBalanceEffectAroundTablePlayers(balanceEffects);
    }

    @handle(BalanceEffectHandlers.UpdateWinEffectAroundTablePlayer)
    showWinningEffectAroundTablePlayers(winningEffects: TWinningEffect[]) {
        return winningEffects;
    }

    @handle(BalanceEffectHandlers.UpdatePayoutBalanceAroundTablePlayer)
    showBalanceEffectAroundTablePlayers(balanceEffects: TBalanceEffect[]) {
        return balanceEffects;
    }
}
