import { _decorator, Label, log, Sprite, SpriteFrame } from "cc";
import gc from "game-client-base";
import Observer from "observer";

import { bundleManager } from "../../bundle-magager/bundle-manager";
import { ChipFlyingHandlers } from "../../chip-flying/scripts/handlers/chip-flying-handler";
import { ObserverComponent } from "../../common/observer-component/scripts/observer-component";

const { Player } = gc;
const { PlayerStore } = Player;

const { ccclass, property } = _decorator;
const { useObserver, render, handle } = Observer;

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

    @handle(ChipFlyingHandlers.SetOwnerAvatar)
    setOwnerAvatar() {
        return this.sprAvatar.node;
    }

    @render(PlayerStore, (store) => store.name)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }

    @render(PlayerStore, (store) => store.avatarId)
    async loadAvatar(avatarId: number) {
        log("Loading avatarId ", avatarId);
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
}
