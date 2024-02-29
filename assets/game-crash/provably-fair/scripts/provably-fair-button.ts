import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { handle } = Observer;
const { GameCrash } = gc;

@ccclass
export class ProvablyFairButton extends ObserverComponent {
    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openPopup: boolean) => handle.handleClientSeedPopup(openPopup))
    onClickPFButton() {
        return true;
    }
}
