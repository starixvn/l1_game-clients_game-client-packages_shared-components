import gc from "@sg/game-client-base";
import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import Observer from "observer";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { MainPlayerProfileHandlers } from "../handlers/main-player-profile-handler";
import { FunctionUtils } from "db://shared-components/shared/utils/function-utils";
import { siteConfigs } from "db://assets/scripts/site-configs";

const { Player, Bet, FormatUtils, GameConfigs } = gc;

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

    onLoad() {
        super.onLoad();
        this.setMainPlayerContainerEffect();
    }

    @handle(MainPlayerProfileHandlers.MainPlayerContainerEffect)
    setMainPlayerContainerEffect() {
        return this.containerEffect;
    }

    @render(MainPlayerStore, (store) => store.displayName)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }

    @render(MainPlayerStore, (store) => store.preferredAvatar)
    async loadAvatar(preferred: { url?: string; id?: number }) {
        if (!this.sprAvatar) {
            return;
        }
        if (preferred.id) {
            const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${preferred.id}/spriteFrame`, SpriteFrame);
            if (spriteFrame) {
                this.setAvatar(spriteFrame);
            }
        }
        if (preferred.url) {
            const spriteFrame = await FunctionUtils.loadAvatarFromUrl(preferred.url, this.getRemoteAvatarBasePath());
            if (spriteFrame) {
                this.setAvatar(spriteFrame);
            }
        }
    }
    getRemoteAvatarBasePath() {
        return `${gc.UrlUtils.buildShareResource(siteConfigs)}/avatars/default.png`;
    }
    setAvatar(frame: SpriteFrame) {
        this.sprAvatar && (this.sprAvatar.spriteFrame = frame);
    }

    @render(MainPlayerStore, (store) => store.balance)
    setBalance(value: number) {
        this.lblBalance && (this.lblBalance.string = FormatUtils.truncateFixedDecimals(value, 2).toString());
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0 && lastReceivedBet.isAnimated) {
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
