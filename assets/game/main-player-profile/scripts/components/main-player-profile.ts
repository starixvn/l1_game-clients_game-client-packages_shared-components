import gc from "@sg/game-client-base";
import { Label, Node, Sprite, SpriteFrame, _decorator, tween } from "cc";
import Observer from "observer";

import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { MainPlayerProfileHandlers } from "../handlers/main-player-profile-handler";
import { isHDType, truncateFixedDecimalsWithConfig } from "db://shared-components/shared/utils";

const { Player, Bet,  GameConfigs, Settlements } = gc;

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

    private currentBalance = 0;
    private settlementStatus: gc.GameServiceMessage.Status = null;
    private isProcessingSettlement = false;

    private readonly CHIP_FLYING_TOTAL_DELAY = 3.75; // delayAnimPayChips (1.25s) + payChipsDuration (1.25s) + chipDelayFlyingTime (1.25s)

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
        if (isHDType()) {
            this.currentBalance = value;

            if (!this.isProcessingSettlement) {
                this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(value));
            }
        } else {
            this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(value));
        }
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettlementStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult, { fireImmediately: false })
    handleSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        if (!settlementResult || !isHDType()) {
            return;
        }

        this.isProcessingSettlement = true;

        tween(this.node)
            .delay(this.CHIP_FLYING_TOTAL_DELAY)
            .call(() => {
                this.updateBalanceUIFromSettlement();
            })
            .start();
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0 && lastReceivedBet.isAnimated) {
            this.mainPlayerDecreaseBalance(lastReceivedBet.value);

            if (isHDType()) {
                this.currentBalance -= lastReceivedBet.value;
                this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(this.currentBalance));
            }
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
    
    private updateBalanceUIFromSettlement() {
        if (this.settlementStatus?.win) {
            this.currentBalance += this.settlementStatus.bet;
            this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(this.currentBalance));
        }
        this.isProcessingSettlement = false;
    }
}
