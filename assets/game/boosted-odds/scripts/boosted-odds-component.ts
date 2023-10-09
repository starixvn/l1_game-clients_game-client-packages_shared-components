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

    @handle(gc.Notification.BoostedOddsStore, (store) => store.increasePopupCounter())
    openPromotions() {}

    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                boostedOddsCounter: store.boostedOddsCounter,
                boostedOddsIconShowedTimeInMiliseconds: store.boostedOddsIconShowedTimeInMiliseconds,
            };
        },
        { fireImmediately: false }
    )
    showBoostedOddIcon(model: { boostedOddsCounter: number; boostedOddsIconShowedTimeInMiliseconds: number }) {
        tween(this.icon)
            .call(() => (this.icon.active = true))
            .delay(model.boostedOddsIconShowedTimeInMiliseconds)
            .call(() => (this.icon.active = false))
            .start();
    }
}
