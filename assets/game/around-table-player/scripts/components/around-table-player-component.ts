import gc from "@sg/game-client-base";
import { Label, Sprite, SpriteFrame, UIOpacity, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../shared/utils";
import { IAroundTablePlayers } from "../stores/around-table-players-chip-store";
import { bundleManager } from "./../../../../shared/common-components/bundle-magager/bundle-manager";
import { AnimationUtils } from "./../../../../shared/utils/utils";

const { ccclass, property } = _decorator;
const { fadeIn, fadeOut } = AnimationUtils;

const { FormatUtils, AroundTablePlayers } = gc;
const { render, handle } = Observer;

@ccclass
export class AroundTablePlayerComponent extends ObserverComponent {
    @property(Label)
    lblNickname: Label = null;

    @property(Label)
    lblBalance: Label = null;

    @property(Sprite)
    avatar: Sprite = null;

    @property
    maxBalanceDisplay = 99999;

    static readonly maxIdleCount = 2;
    public aroundTablePlayer: IAroundTablePlayers = null;

    onLoad() {
        super.onLoad();
        this.node.active = false;
        this.updateMaxBalanceDisplay();
        ComponentUtils.handleLabelFirstLoad([this.lblNickname, this.lblBalance]);
    }

    @handle(AroundTablePlayers.MaxBalanceDisplay)
    updateMaxBalanceDisplay() {}

    @render(AroundTablePlayers.AroundTablePlayersStore, (store) => store.maxBalanceDisplay)
    renderMaxBalanceDisplay(maxBalanceDisplay: number) {
        this.maxBalanceDisplay = maxBalanceDisplay;
    }

    async setInfo(player: IAroundTablePlayers) {
        if (player?.red && player?.name && player?.avatarId) {
            this.node.active = true;
            this.node.getComponent(UIOpacity).opacity = 1;
            await this.updatePlayerInfo(player);
            await fadeIn(this.node, 1);
        } else {
            this.clearPlayerInfo();
            await fadeOut(this.node, 1);
        }
    }

    protected async updatePlayerInfo(player: IAroundTablePlayers) {
        this.setIdentity(player);
        this.setBalance(player.red);
        this.setNickname(player.name);
        await this.setAvatar(player.avatarId);
    }

    private clearPlayerInfo() {
        this.setIdentity(null);
    }

    private setIdentity(player: IAroundTablePlayers) {
        this.aroundTablePlayer = player;
    }

    setBalance(balance: number) {
        this.aroundTablePlayer.red = balance ? balance : 0;
        this.displayBalance(this.aroundTablePlayer.red);
    }

    private setNickname(nickname: string | null) {
        this.updateNicknameLabel(this.truncatedNickname(nickname));
    }

    private truncatedNickname(nickname: string) {
        let truncatedNickname = "";
        if (nickname) {
            if (nickname.length > 8) {
                truncatedNickname = `${nickname.substring(0, 7)}...`;
            } else {
                truncatedNickname = nickname;
            }
        }

        return truncatedNickname;
    }

    private updateNicknameLabel(nickname: string) {
        this.lblNickname.string = nickname;
    }

    private displayBalance(balance: number) {
        this.lblBalance.string =
            balance > this.maxBalanceDisplay
                ? `${FormatUtils.numberWithCommas(this.maxBalanceDisplay)}+`
                : FormatUtils.numberWithCommas(balance, 2);
    }

    async setAvatar(avatarId: number) {
        const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${avatarId}/spriteFrame`, SpriteFrame);
        if (spriteFrame) {
            this.avatar.spriteFrame = spriteFrame;
        }
    }

    increaseBalance(money: number) {
        if (money) {
            this.aroundTablePlayer.red += money;
            this.displayBalance(this.aroundTablePlayer.red);
        }
    }
}
