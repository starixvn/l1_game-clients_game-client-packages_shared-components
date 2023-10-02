import { _decorator, instantiate, Label, Node, Prefab, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "./handlers/auto-play-handler";
import { AutoPlayStore } from "./stores/auto-play-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlay extends ObserverComponent {
    @property(Label)
    lblnoOfRound: Label = null;

    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @property(Prefab)
    prfautoPlayPopup: Prefab = null;

    @property(Node)
    nodeAutoPlayPopup: Node = null;

    onLoad() {
        super.onLoad();
        this.initAutoPlayPopup();
    }

    initAutoPlayPopup() {
        const node = instantiate(this.prfautoPlayPopup);
        this.nodeAutoPlayPopup.addChild(node);
        this.nodeAutoPlayPopup.children[0].active = false;
    }

    @handle(AutoPlayHandler, (handle) => handle.openAutoPlayPopup())
    clickAutoPlay() {}

    @render(AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    showPopup(status: boolean) {
        this.nodeAutoPlayPopup.children[0].active = status;
    }
}
