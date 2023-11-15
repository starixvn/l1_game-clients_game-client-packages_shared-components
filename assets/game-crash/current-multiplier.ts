import gc from "@sg/game-client-base";
import { Label, Node, UIOpacity, _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { FormatUtils, GameCrash } = gc;

@ccclass("current_multiplier")
export class CurrentMultiplier extends ObserverComponent {
    @property(Label)
    lblCurrentMultiplier: Label = null;

    @property(Node)
    nodeMultiplierText: Node = null;

    @property(Node)
    nodeCrashText: Node = null;

    onLoad() {
        this.setVisibility(false);
        super.onLoad();
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.setVisibility(true);
        this.setCurrMultiplierValue(multiplier);
        this.showHideBottomText(false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    hideCurrentMultiplier(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.setVisibility(false);
        }
    }

    setVisibility(status: boolean) {
        this.getComponent(UIOpacity).opacity = status ? 255 : 0;
    }

    setCurrMultiplierValue(multiplier: number) {
        this.lblCurrentMultiplier.string = `${FormatUtils.numberWithCommas(multiplier, 2, false)}x`;
    }

    showHideBottomText(isCrashed: boolean) {
        this.nodeCrashText.active = isCrashed;
        this.nodeMultiplierText.active = !isCrashed;
    }
}
