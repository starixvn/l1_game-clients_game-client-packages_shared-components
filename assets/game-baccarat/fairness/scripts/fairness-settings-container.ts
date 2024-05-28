import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { GameBaccaratX } = gc;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessSettingsContainer extends ObserverComponent {
    @property(Prefab)
    prfCutCardSetting: Prefab = null;
    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoeHash)
    renderNewShoeHash(newShoeHash: GameServiceMessage.NewShoeHash) {
        if (!newShoeHash) {
            return;
        }
        const setting = instantiate(this.prfCutCardSetting);
        this.node.addChild(setting);
    }

    onLoad() {
        this.renderNewShoeHash({ hashValue: "abc" });
    }
}
