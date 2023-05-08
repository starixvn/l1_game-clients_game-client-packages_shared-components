import { Component, director } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import { LogStore } from "../stores/log-store";

const { handle, render } = Observer;

export default class StartupComponent extends Component {
    onLoad() {
        this.connectToService();
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.Auth.AuthStore, (store) => store.isSessionTimeout)
    loadSessionTimeoutScene(isSessionTimeout: boolean) {
        isSessionTimeout && director.loadScene("session-timeout");
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }
}
