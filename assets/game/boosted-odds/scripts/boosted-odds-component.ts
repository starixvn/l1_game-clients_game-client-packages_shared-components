import { _decorator, Component, Node } from "cc";
import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { settings } from "../../../../../../assets/game/scripts/game-settings";

const { ccclass, property } = _decorator;
const { handle, observer } = Observer;

const { BoostedOdds } = gc;

@ccclass("BoostedOddsComponent")
@observer(settings.name)
export default class BoostedOddsComponent extends ObserverComponent {
    @property(Node)
    icon: Node | null = null;

    showPopup: boolean = false;

    onLoad() {
        // PromotionNotificationsHandler.getInstance().on(PromotionNotificationsEvent.OPEN_ANNOUNCEMENT, this.onClickBoostedOdds.bind(this));
    }
    handleBoostedOdds() {
        // cc.tween(this.icon)
        // .call(() => (this.icon.active = true))
        // .delay(10)
        // .call(() => (this.icon.active = false))
        // .start();
    }
    onDisable() {
        // this.node.stopAllActions();
    }

    @handle(gc.BoostedOdds.BoostedOddsPopupHandlers, (handler, showPopup: boolean) => {
        handler.handleShowPopup(showPopup);
    })
    hanldeShowPromotions() {
        this.showPopup = !this.showPopup;
        return this.showPopup;
    }

    openPromotions() {
        this.hanldeShowPromotions();
    }
}
