import { _decorator, Node, tween } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import * as actions from "../../.././sliding-chip/scripts/components/actions";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { TBalanceEffect, TWinningEffect } from "../../../balance-effect/scripts/stores/balance-effect-store";
import { BetItems } from "../../../bets/scripts/components/bet-items";
import { BetItemStore, IAroundTablePlayersChips, IMainPlayerChip, TChipAmount } from "../../../bets/scripts/stores/bet-item-store";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { AroundTablePlayers } from "../../../games/around-table-player/scripts/components/around-table-players";
import { AroundTablePlayerUtils } from "../../../games/around-table-player/scripts/utils";
import SlidingChip from "../../../sliding-chip/scripts/components/sliding-chip";
import { NumberUtils } from "../../../utils";
import { ChipFlyingStore, TPayChipInfo } from "../stores/chip-flying-store";
import { ActionChipFlying } from "./actions";

const { Auth, Chips } = gc;
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

    @render(BetItemStore, (store) => store.aroundTablePlayersChips)
    flyChipJoinGame(mainPlayersChips: IAroundTablePlayersChips) {
        const { chips, mainPlayerRate } = mainPlayersChips ?? {};
        if (!chips && !mainPlayerRate) {
            return;
        }

        for (const rate in chips) {
            const chipValues = chips[rate];

            for (const betItem of this.betItems.betItemComponents) {
                const chipAmount = chipValues[betItem.betChoice];

                if (chipAmount) {
                    const chipAmountConvert = this.getChipValueByCurrency(chipAmount, mainPlayerRate, +rate);
                    actions.addChipsToChipBoxWhenJoinRoom(betItem.chipBox, chipAmountConvert, this.slidingChip);
                }
            }
        }
    }

    private getChipValueByCurrency(chipAmount: TChipAmount, playerRate: number, chipRate: number) {
        const chipAmountConvert: TChipAmount = {};
        for (const chipValue in chipAmount) {
            const convertChipValue = NumberUtils.getValueByCurrency(+chipValue, playerRate, chipRate);

            chipAmountConvert[convertChipValue] = chipAmount[chipValue];
        }

        return chipAmountConvert;
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
            chipAmount: amount,
        };
        actions.placeChipToChipBox(this.slidingChip, mainPlayerChip, null, null);
        this.playSoundSingleChip();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSingleChip() {
        return gc.Audios.AudioIds.SINGLE_CHIP;
    }

    @render(ChipFlyingStore, (store) => store.payChipInfo)
    payChips(payChipInfo: TPayChipInfo) {
        const { finish } = payChipInfo ?? {};

        if (!this || !finish?.settlementResult || !this.enablePlaceChips || !this.node) {
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

    private payChipToAllPlayers = (payChipInfo: TPayChipInfo) => {
        const { settleStatus } = payChipInfo;
        const chipFlyingInfo: IChipFlyingInfo = {
            slidingChip: this.slidingChip,
            hiddenPlayersNode: this.hiddenPlayersNode,
            mainPlayerAvatarNode: this.mainPlayerAvatarNode,
            isChipStack: this.isChipStack,
            payChipsDuration: this.payChipsDuration,
        };
        ActionChipFlying.payChipsToMainPlayer(payChipInfo?.settleStatus, chipFlyingInfo, this.betItems?.winBetItems);
        this.showPayoutForMainPlayer(settleStatus);

        if (this.hiddenPlayersNode) {
            ActionChipFlying.payChipsToHiddenPlayers(this.hiddenPlayersNode, this.isChipStack, this.betItems?.winBetItems);
        }

        this.payChipsToAroundTablePlayers(payChipInfo);
    };

    private showPayoutForMainPlayer(settleStatus: gc.Settlements.SettlementStatusStore) {
        if (settleStatus?.win) {
            this.mainPlayerIncreaseBalance(settleStatus?.bet);
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

    @handle(BalanceEffectHandlers.MainPlayerUpdateWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    payChipsToAroundTablePlayers(payChipInfo: TPayChipInfo) {
        const { finish } = payChipInfo;
        const winningPlayers = finish.winningPlayers;

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
        this.AroundTablePlayersUpdateIncreaseBalance(balanceEffects);
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersUpdateWinEffect)
    aroundTablePlayersShowWinningEffect(winningEffects: TWinningEffect[]) {
        return winningEffects;
    }

    @handle(BalanceEffectHandlers.AroundTablePlayersUpdateIncreaseBalance)
    AroundTablePlayersUpdateIncreaseBalance(balanceEffects: TBalanceEffect[]) {
        return balanceEffects;
    }
}
