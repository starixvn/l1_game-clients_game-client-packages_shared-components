import { _decorator, Component, Node, tween } from "cc";
import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { settings } from "../../../../../../assets/game/scripts/game-settings";

const { ccclass, property } = _decorator;
const { handle, observer, render } = Observer;

@ccclass("BoostedOddsComponent")
@observer(settings.name)
export default class BoostedOddsComponent extends ObserverComponent {
    @property(Node)
    icon: Node | null = null;

    showPopup: boolean = false;

    onDisable() {
        // this.node.stopAllActions();
    }

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.PromotionHandlers, (handler) => {
        handler.handleShowPopup(true);
    })
    hanldeShowPromotions() {
        // this.showPopup = !this.showPopup;
        // return this.showPopup;
    }

    openPromotions() {
        this.hanldeShowPromotions();
    }

    @render(gc.Notification.BoostedOddsStore, (store) => store.counter, { fireImmediately: false })
    showBoostedOddIcon() {
        tween(this.icon)
            .call(() => (this.icon.active = true))
            .delay(10)
            .call(() => (this.icon.active = false))
            .start();
    }
}
