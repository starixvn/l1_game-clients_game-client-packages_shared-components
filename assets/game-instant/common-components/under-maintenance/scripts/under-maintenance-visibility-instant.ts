import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle, observer } = Observer;
const { App } = gc;

@ccclass("UnderMaintenanceVisibilityInstant")
export class UnderMaintenanceVisibilityInstant extends ObserverComponent {
    onLoad(): void {
        super.onLoad();
        this.node.active = false;
    }
    @render(App.AppStore, (store) => store.isUM)
    redirectToSessionTimeoutPage(isUM: boolean) {
        if (isUM) {
            this.node.active = true;
        }
    }
}
