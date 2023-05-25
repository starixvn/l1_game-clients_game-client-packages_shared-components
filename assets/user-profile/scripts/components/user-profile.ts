import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";

import { bundleManager } from "db://shared-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "db://shared-components/common/observer-component/scripts/observer-component";
import { UserProfileHandlers } from "../handlers/user-profile-handler";
import { TEndBetInfo, UserProfileStore } from "../stores/user-profile-store";

const { Player } = gc;
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
        this.setOwnerAvatar();
    }

    @handle(UserProfileHandlers.SetOwnerAvatar)
    setOwnerAvatar() {
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

    @render(UserProfileStore, (store) => store.endBetInfo)
    endBetInfo(endBetInfo: TEndBetInfo) {
        const { bet, balanceContainer, ownerAvatar, isProcessingBet } = endBetInfo;
        if (bet > 0 && !isProcessingBet) {
            balanceContainer.updateBalance(ownerAvatar, false, bet, 1, 80);
        }
    }
}
