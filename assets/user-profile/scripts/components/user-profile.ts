import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";

import { bundleManager } from "db://shared-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "db://shared-components/common/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { UserProfileHandlers } from "../handlers/user-profile-handler";

const { Player, Bet } = gc;
const { PlayerStore } = Player;

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class UserProfile extends ObserverComponent {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblBalance: Label = null;

    @property(Sprite)
    sprAvatar: Sprite = null;

    onLoad() {
        super.onLoad();
        this.setMainPlayerAvatar();
    }

    @handle(UserProfileHandlers.SetMainPlayerAvatar)
    setMainPlayerAvatar() {
        return this.sprAvatar.node;
    }

    @render(PlayerStore, (store) => store.name)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }

    @render(PlayerStore, (store) => store.avatarId)
    async loadAvatar(avatarId: number) {
        const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${avatarId}/spriteFrame`, SpriteFrame);
        if (spriteFrame) {
            this.setAvatar(spriteFrame);
        }
    }

    setAvatar(frame: SpriteFrame) {
        this.sprAvatar && (this.sprAvatar.spriteFrame = frame);
    }

    @render(PlayerStore, (store) => store.balance)
    setBalance(value: number) {
        this.lblBalance.string = value.toString();
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.updateBalance(lastReceivedBet.value);
        }
    }

    @handle(BalanceEffectHandlers.UpdateBalanceWhenBet)
    updateBalance(balance: number) {
        return balance;
    }
}
