import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../shared/utils/component-utils";
const { ccclass, property } = _decorator;

const { GameCrash, Rounds, FormatUtils, Translator } = gc;
const { handle, render } = Observer;

@ccclass("place_bet_notice")
export class PlaceBetNotice extends ObserverComponent {
    onLoad(): void {
        this.node.active = false;
        super.onLoad();
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            ComponentUtils.autoDisappear(this.node, false);
        } else {
            this.node.active = false;
        }
    }

    @render(GameCrash.PlayerActions.PlayerActionStore, (store) => store.buttonState)
    handleNotice(buttonState: string) {
        if (buttonState === GameCrash.ButtonState.BET_ACCEPTED) {
            this.showNotice(true);
        }
    }
}
