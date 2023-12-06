import gc from "@sg/game-client-base";
import { Label, Node, UIOpacity, _decorator } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameCrash } = gc;

@ccclass("current_multiplier")
export class CurrentMultiplier extends ObserverComponent {
    @property(Label)
    lblCurrentMultiplier: Label = null;

    @property(Node)
    nodeMultiplierText: Node = null;

    @property(Node)
    nodeCrashText: Node = null;

    private crashSound = "plane_explose";

    onLoad() {
        this.setVisibility(false);
        super.onLoad();
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.setVisibility(true);
        this.setCurrMultiplierValue(multiplier);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    updateBottomText(isCrashed: boolean) {
        isCrashed && this.playSoundCrash();
        this.showHideBottomText(isCrashed);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    hideCurrentMultiplier(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.setVisibility(false);
            this.updateIsCrashed(false);
        }
    }

    @handle(GameCrash.CrashMultiplier.MultiplierHandlers, (handle, isCrashed: boolean) => handle.handleIsCrashed(isCrashed))
    updateIsCrashed(isCrashed: boolean) {
        return isCrashed;
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

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundCrash() {
        return this.crashSound;
    }
}
