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

    @render(gc.App.AppStore, (store) => store.isUM)
    loadUMScene(isUM: boolean) {
        isUM && director.loadScene("under-maintenance");
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {
        console.log(message);
    }
}
