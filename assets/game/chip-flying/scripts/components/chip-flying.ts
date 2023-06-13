import { _decorator, Node, tween } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import * as actions from "../../.././sliding-chip/scripts/components/actions";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { TBalanceEffect, TWinningEffect } from "../../../balance-effect/scripts/stores/balance-effect-store";
import { BetItems } from "../../../bets/scripts/components/bet-items";
import { IMainPlayerChip } from "../../../bets/scripts/stores/bet-item-store";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AroundTablePlayers } from "../../../around-table-player/scripts/components/around-table-players";
import { AroundTablePlayerUtils } from "../../../around-table-player/scripts/utils";
import { ActionChipFlying } from "./actions";

const { Auth, Chips, NumberUtils, Settlements, Rounds } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

export interface IChipFlyingInfo {
    slidingChip: SlidingChip;
    hiddenPlayersNode: Node;
    mainPlayerAvatarNode: Node;
    isChipStack: boolean;
    payChipsDuration: number;
}

@ccclass
export class ChipFlying extends ObserverComponent {
    @property(Node)
    mainPlayerAvatarNode: Node = null;

    @property(Node)
    hiddenPlayersNode: Node = null;

    @property(Node)
    dealerChipBox: Node = null;

    @property(SlidingChip)
    slidingChip: SlidingChip = null;

    @property(AroundTablePlayers)
    aroundTablePlayers: AroundTablePlayers = null;

    @property(BetItems)
    betItems: BetItems = null;

    protected enablePlaceChips = true;
    protected isChipStack = false;
    protected payChipsDuration = 1.2;
    protected chipDelayFlyingTime = 1.25;

    protected settlementStatus: gc.GameServiceMessage.Status = null;

    @render(Chips.ChipStore, (store) => store.chipsByMainPlayerRate)
    flyChipJoinGame(chipsByMainPlayerRate: gc.Chips.TChipsByMainPlayerRate) {
        if (!chipsByMainPlayerRate) {
            return;
        }

        for (const betItem of this.betItems.betItemComponents) {
            const chipGroup = chipsByMainPlayerRate[betItem.betChoice];
            if (chipGroup) {
                actions.addChipsToChipBoxWhenJoinRoom(betItem.chipBox, chipGroup, this.slidingChip);
            }
        }
    }

    @render(Chips.ChipStore, (store) => store.ownChip)
    flyChip(ownChip: gc.GameServiceMessage.OwnChip) {
        const { betChoice, amount } = ownChip ?? {};
        if (!betChoice || !amount) {
            return;
        }

        const betItem = this.betItems?.betItemComponents.find((item) => betChoice === item.betChoice);
        const mainPlayerChip: IMainPlayerChip = {
            chipBox: betItem?.chipBox,
            chipValue: amount,
        };
        actions.placeChipToChipBox(this.slidingChip, mainPlayerChip, null, null);
        this.playSoundSingleChip();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSingleChip() {
        return gc.Audios.AudioIds.SINGLE_CHIP;
    }

    @render(Settlements.SettlementStore, (store) => store.payChipInfo)
    payChips(payChipInfo: gc.Settlements.TPayChipInfo) {
        if (!this || !payChipInfo?.settlementResult || !this.enablePlaceChips || !this.node) {
            return;
        }

        if (!this.node.activeInHierarchy) {
            ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems);
            ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems);
            this.isChipStack && ActionChipFlying.removeChipStack(this.betItems?.winBetItems);
            this.payChipToAllPlayers(payChipInfo);
        } else {
            tween(this.node)
                .delay(this.chipDelayFlyingTime)
                .call(() => {
                    ActionChipFlying.dealerGetChips(this.dealerChipBox, this.betItems?.lostBetItems);
                })
                .delay(this.chipDelayFlyingTime)
                .call(() => {
                    ActionChipFlying.dealerPayChips(this.dealerChipBox, this.betItems?.winBetItems);
                })
                .delay(this.chipDelayFlyingTime)
                .call(() => {
                    this.isChipStack && ActionChipFlying.removeChipStack(this.betItems?.winBetItems);
                    this.payChipToAllPlayers(payChipInfo);
                })
                .start();
        }
    }

    private payChipToAllPlayers = (payChipInfo: gc.Settlements.TPayChipInfo) => {
        const chipFlyingInfo: IChipFlyingInfo = {
            slidingChip: this.slidingChip,
            hiddenPlayersNode: this.hiddenPlayersNode,
            mainPlayerAvatarNode: this.mainPlayerAvatarNode,
            isChipStack: this.isChipStack,
            payChipsDuration: this.payChipsDuration,
        };

        ActionChipFlying.payChipsToMainPlayer(this.settlementStatus, chipFlyingInfo, this.betItems?.winBetItems);
        this.showPayoutForMainPlayer();

        if (this.hiddenPlayersNode) {
            ActionChipFlying.payChipsToHiddenPlayers(this.hiddenPlayersNode, this.isChipStack, this.betItems?.winBetItems);
        }

        this.payChipsToAroundTablePlayers(payChipInfo);
    };

    private showPayoutForMainPlayer() {
        if (this.settlementStatus?.win) {
            this.mainPlayerIncreaseBalance(this.settlementStatus?.bet);
            this.mainPlayerPlayWinningEffect();
            this.getBalance();
        }
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    payChipsToAroundTablePlayers(payChipInfo: gc.Settlements.TPayChipInfo) {
        const winningPlayers = payChipInfo.winningPlayers;

        if (!winningPlayers) {
            return;
        }

        const winningPlayerIds = Object.keys(winningPlayers);
        const winningEffects: TWinningEffect[] = [];
        const balanceEffects: TBalanceEffect[] = [];

        winningPlayerIds.forEach((playerId) => {
            const aroundTablePlayerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(
                this.aroundTablePlayers?.aroundTablePlayerComponents,
                playerId
            );
            if (!aroundTablePlayerSlot) {
                return;
            }

            const winningPlayerData = winningPlayers[playerId];
            const playerBetItems = winningPlayerData.winningByChoices;
            const { bet, rate } = winningPlayerData;

            this.betItems.winBetItems.forEach((item) => {
                if (playerBetItems && playerBetItems[item.betChoice] > 0) {
                    const chipNode = !this.isChipStack ? item.chipBox : item.chipBox.children[0];
                    chipNode &&
                        this.slidingChip.moveChipsWithRandomAmount(chipNode, aroundTablePlayerSlot.avatar.node, this.payChipsDuration);
                }
            });

            const convertValue = NumberUtils.getValueByCurrency(bet, rate || 1);
            aroundTablePlayerSlot.increaseBalance(convertValue);
            winningEffects.push({ avatarNode: aroundTablePlayerSlot.node, status: true });
            balanceEffects.push({ avatarNode: aroundTablePlayerSlot.node, balance: convertValue });
        });

        this.aroundTablePlayersShowWinningEffect(winningEffects);
        this.updateAroundTablePlayersIncreaseBalance(balanceEffects);
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersWinEffect)
    aroundTablePlayersShowWinningEffect(winningEffects: TWinningEffect[]) {
        return winningEffects;
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersIncreaseBalance)
    updateAroundTablePlayersIncreaseBalance(balanceEffects: TBalanceEffect[]) {
        return balanceEffects;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettleStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && (this.settlementStatus = null);
    }
}
