import { _decorator, Node, tween } from "cc";
import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass("BoostedOddsComponent")
export default class BoostedOddsComponent extends ObserverComponent {
    @property(Node)
    icon: Node | null = null;

    showPopup: boolean = false;

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.PromotionHandlers, (handler) => {
        handler.handleShowPopup();
    })
    openPromotions() {}

    @render(gc.Notification.BoostedOddsStore, (store) => store.boostedOddsCounter, { fireImmediately: false })
    showBoostedOddIcon() {
        tween(this.icon)
            .call(() => (this.icon.active = true))
            .delay(10)
            .call(() => (this.icon.active = false))
            .start();
    }
}
