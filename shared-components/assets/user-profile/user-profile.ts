import { _decorator, Component, Label, log, Sprite, SpriteFrame } from "cc";
import gc from "game-client-base";
import Observer from "observer";

import { bundleManager } from "../bundle-magager/bundle-manager";

const { Player } = gc;
const { PlayerStore } = Player;

const { ccclass, property, menu } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer
export default class UserProfile extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblBalance: Label = null;

    @property(Sprite)
    sprAvatar: Sprite = null;

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
