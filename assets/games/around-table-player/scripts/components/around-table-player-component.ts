import { Label, Sprite, SpriteFrame, UIOpacity, _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { bundleManager } from "../../../../bundle-magager/bundle-manager";
import { ObserverComponent } from "../../../../common/observer-component/scripts/observer-component";
import { NumberUtils } from "../../../../utils";
import { AnimationUtils } from "../../../../utils/utils";
import { AroundTablePlayersHandlers } from "../handlers/around-table-players-handler";
import { IAroundTablePlayers } from "../stores/around-table-players-store";

const { handle } = Observer;
const { ccclass, property } = _decorator;
const { fadeIn, fadeOut } = AnimationUtils;

const { FormatUtils } = gc;

@ccclass
export class AroundTablePlayerComponent extends ObserverComponent {
    @property(Label)
    lblNickname: Label = null;

    @property(Label)
    lblBalance: Label = null;

    @property(Sprite)
    avatar: Sprite = null;

    static readonly maxIdleCount = 2;
    private _maxBalanceDisplay = 99999;

    get maxBalanceDisplay() {
        return this._maxBalanceDisplay;
    }

    set maxBalanceDisplay(maxBalance: number) {
        this._maxBalanceDisplay = maxBalance;
    }

    aroundTablePlayer: IAroundTablePlayers;

    onLoad() {
        super.onLoad();
        this.node.active = false;
        this.registerOtherPlayers();
    }

    @handle(AroundTablePlayersHandlers.SetPlayerComponent)
    registerOtherPlayers() {
        return this;
    }

    get isIdle() {
        return this.aroundTablePlayer.idleCount > AroundTablePlayerComponent.maxIdleCount;
    }

    async setInfo(player: IAroundTablePlayers) {
        this.node.active = true;
        this.node.getComponent(UIOpacity).opacity = 0;
        try {
            if (player) {
                await this.updatePlayerInfo(player);
                await fadeIn(this.node, 1);
            } else {
                this.clearPlayerInfo();
                await fadeOut(this.node, 1);
            }
        } catch (error) {
            console.error("Error in setInfo visible player:", error);
        }
    }

    protected async updatePlayerInfo(player: IAroundTablePlayers) {
        this.setIdentity(player);
        this.setBalance(player.red);
        this.setNickname(player.name);
        await this.setAvatar(player.avatarId);
    }

    private clearPlayerInfo() {
        this.aroundTablePlayer = null;
        this.setIdentity(null);
        this.setNickname(null);
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
        const convertValue = NumberUtils.getValueByCurrency(balance, 1);
        this.lblBalance.string =
            convertValue > this.maxBalanceDisplay
                ? `${FormatUtils.numberWithCommas(this.maxBalanceDisplay)}+`
                : FormatUtils.numberWithCommas(convertValue, 2);
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
