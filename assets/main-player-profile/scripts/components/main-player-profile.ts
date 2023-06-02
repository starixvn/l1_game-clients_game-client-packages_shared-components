import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";

import { bundleManager } from "db://shared-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "db://shared-components/common/observer-component/scripts/observer-component";
import { BalanceEffectHandlers } from "../../../balance-effect/scripts/handlers/balance-effect-handlers";
import { MainPlayerProfileHandlers } from "../handlers/main-player-profile-handler";

const { Player, Bet } = gc;
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

    onLoad() {
        super.onLoad();
        this.setMainPlayerAvatar();
    }

    @handle(MainPlayerProfileHandlers.SetMainPlayerAvatar)
    setMainPlayerAvatar() {
        return this.sprAvatar.node;
    }

    @render(MainPlayerStore, (store) => store.name)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }

    @render(MainPlayerStore, (store) => store.avatarId)
    async loadAvatar(avatarId: number) {
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
        this.lblBalance.string = value.toString();
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.updateBalance(lastReceivedBet.value);
        }
    }

    @handle(BalanceEffectHandlers.UpdateBetBalanceMainPlayer)
    updateBalance(balance: number) {
        return balance;
    }
}
