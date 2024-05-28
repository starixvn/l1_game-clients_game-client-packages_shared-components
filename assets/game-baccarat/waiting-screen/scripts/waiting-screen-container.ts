import gc from "@sg/game-client-base";
import { Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { render, handle, observer } = Observer;
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX } = gc;

@ccclass
export class WaitingScreenContainer extends ObserverComponent {
    @property(Prefab)
    prefabWaitingScreen: Prefab = null;

    onLoad(): void {
        const waiting = instantiate(this.prefabWaitingScreen);
        this.node.addChild(waiting);
        super.onLoad();
    }

    @render(CutCardPF.CutCardStore, (store) => store.cutCardInfo)
    showNode(cutCardInfo: any) {
        if (!cutCardInfo || !cutCardInfo.successful) {
            return;
        }
        this.node.active = true;
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    hideNode(shoeInfo: any) {
        if (shoeInfo) {
            this.node.active = false;
        }
    }
}
