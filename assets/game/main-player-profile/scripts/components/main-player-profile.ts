import gc from "@sg/game-client-base";
import { Label, Node, Sprite, SpriteFrame, _decorator, tween } from "cc";
import Observer from "observer";

import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { MainPlayerProfileHandlers } from "../handlers/main-player-profile-handler";
import { systemTypes, SystemTypeUtils } from "db://shared-components/utils/system-type-behavior/system-type-behavior";

const { Player, Bet, FormatUtils, GameConfigs, Settlements } = gc;

const { MainPlayerStore } = Player;

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class MainPlayerProfile extends ObserverComponent {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblBalance: Label = null;

    @property(Sprite)
    sprAvatar: Sprite = null;

    @property(Node)
    containerEffect: Node = null;

    @property(Node)
    userScoinWallet: Node = null;

    @property(Label)
    lblScoin: Label = null;

    private currentBalance: number = 0;
    private settlementStatus: gc.GameServiceMessage.Status = null;
    private isProcessingSettlement: boolean = false;

    onLoad() {
        super.onLoad();
        this.setMainPlayerContainerEffect();
    }

    @handle(MainPlayerProfileHandlers.MainPlayerContainerEffect)
    setMainPlayerContainerEffect() {
        return this.containerEffect;
    }

    @render(MainPlayerStore, (store) => store.name)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }

    @render(MainPlayerStore, (store) => store.avatarId)
    async loadAvatar(avatarId: number) {
        if (!this.sprAvatar) {
            return;
        }

        const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${avatarId}/spriteFrame`, SpriteFrame);
        if (spriteFrame) {
            this.setAvatar(spriteFrame);
        }
    }

    setAvatar(frame: SpriteFrame) {
        this.sprAvatar && (this.sprAvatar.spriteFrame = frame);
    }

    @render(MainPlayerStore, (store) => store.balance)
    setBalance(value: number) {
        this.currentBalance = value;
        
        if (!this.isProcessingSettlement) {
            this.lblBalance && (this.lblBalance.string = FormatUtils.truncateFixedDecimals(value, 2).toString());
        }
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettlementStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult, { fireImmediately: false })
    handleSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        if (!settlementResult || !SystemTypeUtils.isSystemType(systemTypes?.HD)) {
            return;
        }
        
        this.isProcessingSettlement = true;
        
        // delayAnimPayChips (1.25s) + payChipsDuration (1.25s) + chipDelayFlyingTime (1.25s) = 3.75s total
        const chipFlyingDelay = 3.75;

        tween(this.node)
            .delay(chipFlyingDelay)
            .call(() => {
                this.updateBalanceUIFromSettlement();
            })
            .start();
    }

    updateBalanceUIFromSettlement() {
        if (this.settlementStatus?.win) {
            const winAmount = this.settlementStatus?.bet;
            this.currentBalance += winAmount;

            this.lblBalance && (this.lblBalance.string = FormatUtils.truncateFixedDecimals(this.currentBalance, 2).toString());
        }
        
        this.isProcessingSettlement = false;
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0 && lastReceivedBet.isAnimated) {
            this.currentBalance -= lastReceivedBet.value;
            this.lblBalance && (this.lblBalance.string = FormatUtils.truncateFixedDecimals(this.currentBalance, 2).toString());

            this.mainPlayerDecreaseBalance(lastReceivedBet.value);
        }
    }

    @handle(BalanceEffectHandlers.MainPlayerDecreaseBalance)
    mainPlayerDecreaseBalance(balance: number) {
        return balance;
    }

    @render(GameConfigs.GameConfigStore, (store) => store.enableFreeBet)
    activeUserScoinWallet(enableFreeBet: boolean) {
        this.userScoinWallet && (this.userScoinWallet.active = enableFreeBet);
    }

    @render(MainPlayerStore, (store) => store.scoin)
    setScoin(scoin: number) {
        this.lblScoin && (this.lblScoin.string = scoin.toString());
    }
}
