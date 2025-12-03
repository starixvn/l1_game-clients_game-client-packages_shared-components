import gc from "@sg/game-client-base";
import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import Observer from "observer";

import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { MainPlayerProfileHandlers } from "../handlers/main-player-profile-handler";
import { isHDType, truncateFixedDecimalsWithConfig } from "db://shared-components/shared/utils";

const { Player, Bet, GameConfigs } = gc;

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

    onLoad() {
        console.log('[ZLOG] - onLoad - called :::');
        console.log('[ZLOG] - onLoad - lblBalance :::', this.lblBalance);
        console.log('[ZLOG] - onLoad - lblBalance exists :::', !!this.lblBalance);
        console.log('[ZLOG] - onLoad - currentBalance :::', this.currentBalance);
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
        console.log('[ZLOG] - setBalance - called with value :::', value);
        console.log('[ZLOG] - setBalance - isHDType :::', isHDType());
        console.log('[ZLOG] - setBalance - currentBalance BEFORE :::', this.currentBalance);

        if (isHDType()) {
            console.log('[ZLOG] - setBalance - HD type detected :::');
            this.currentBalance = value;
        }
        this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(value));
        console.log('[ZLOG] - setBalance - UI updated with :::', truncateFixedDecimalsWithConfig(value));
        console.log('[ZLOG] - setBalance - completed :::');
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        console.log('[ZLOG] - endBetInfo - called with :::', lastReceivedBet);
        console.log('[ZLOG] - endBetInfo - lastReceivedBet.value :::', lastReceivedBet?.value);
        console.log('[ZLOG] - endBetInfo - lastReceivedBet.isAnimated :::', lastReceivedBet?.isAnimated);

        if (lastReceivedBet && lastReceivedBet.value > 0 && lastReceivedBet.isAnimated) {
            console.log('[ZLOG] - endBetInfo - processing bet decrease :::');
            this.mainPlayerDecreaseBalance(lastReceivedBet.value);

            if (isHDType()) {
                console.log('[ZLOG] - endBetInfo - currentBalance BEFORE subtract :::', this.currentBalance);
                this.currentBalance -= lastReceivedBet.value;
                console.log('[ZLOG] - endBetInfo - currentBalance AFTER subtract :::', this.currentBalance);
                this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(this.currentBalance));
                console.log('[ZLOG] - endBetInfo - UI updated with :::', truncateFixedDecimalsWithConfig(this.currentBalance));
            }
        }
    }

    @handle(BalanceEffectHandlers.MainPlayerDecreaseBalance)
    mainPlayerDecreaseBalance(balance: number) {
        console.log('[ZLOG] - mainPlayerDecreaseBalance - called with :::', balance);
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
