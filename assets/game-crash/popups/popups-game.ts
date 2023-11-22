import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { PopupsGameStore } from "./popups-game-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class PopupsGame extends ObserverComponent {
    @render(PopupsGameStore, (store) => store.enabledOverlay)
    showHideOverlayBg(enabledOverlay: boolean) {
        this.node.active = enabledOverlay;
    }
}
