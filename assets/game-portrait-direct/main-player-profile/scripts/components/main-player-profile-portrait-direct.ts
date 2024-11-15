import { _decorator, Sprite } from "cc";

import MainPlayerProfile from "../../../../game/main-player-profile/scripts/components/main-player-profile";
const { ccclass, property } = _decorator;

@ccclass
export default class MainPlayerProfilePortraitDirect extends MainPlayerProfile {
    @property(Sprite)
    bgDollar: Sprite = null;

    activeUserScoinWallet(enableFreeBet: boolean) {
        super.activeUserScoinWallet(enableFreeBet);
        this.bgDollar.enabled = enableFreeBet;
    }
}
