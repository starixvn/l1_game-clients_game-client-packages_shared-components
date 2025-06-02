import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { handle, observer } = Observer;
@ccclass
export class AudioObserver extends ObserverComponent {
    playClick() {
        this.playSFX("click");
    }

    @handle(gc.Audios.AudioHandler, (handler, id: string) => handler.playSFX(id))
    playSFX(id: string) {
        return id;
    }
}
