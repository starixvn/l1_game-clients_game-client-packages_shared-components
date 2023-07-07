import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ReBetButton } from "./rebet-button";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Bet, Rounds } = gc;

@ccclass("ReBet")
export class ReBet extends ObserverComponent {
    @property(ReBetButton)
    reBetButton: ReBetButton = null;

    onLoad(): void {
        super.onLoad();
        this.loadRuleReBetStorage();
    }

    @handle(gc.Bet.ReBetHandlers.LoadRuleReBetStorage)
    loadRuleReBetStorage() {}

    @render(Bet.ReBetStore, (store) => store.isShowBtnReBet, { fireImmediately: false })
    checkReBetStatus(isShowBtnReBet: boolean) {
        this.reBetButton.changeInteractable(isShowBtnReBet);
    }

    @handle(gc.Bet.ReBetHandlers.ReBetHandler)
    onReBet() {
        this.playSoundClick();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isVisibleReBet, { fireImmediately: false })
    visibleReBetBtn(isVisibleReBet: boolean) {
        isVisibleReBet && this.reBetButton.changeInteractable(false);
    }
}
