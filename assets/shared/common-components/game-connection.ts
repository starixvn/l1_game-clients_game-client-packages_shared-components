import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class GameConnection extends ObserverComponent {
    openGameCallback = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        this.openGameCallback();
    }
}
