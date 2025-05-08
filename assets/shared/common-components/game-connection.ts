import gc from "@sg/game-client-base";
import { _decorator, Component } from "cc";
import { settings } from "db://assets/game/scripts/game-settings";
import Observer from "observer";
import { siteConfigs } from "../../../../../assets/scripts/site-configs";

const { ccclass } = _decorator;
const { handle, render, observer } = Observer;

const { Auth, AppTypes } = gc;

@ccclass
@observer(settings.name)
export default class GameConnection extends Component {
    protected system: number = AppTypes.Club;
    protected isMiniGame: boolean = false;
    openGameCallback = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {
        return { ...siteConfigs?.websocketOptions };
    }

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        this.openGameCallback();
    }

    @render(Auth.AuthStore, (store) => store.system)
    openGame(system: number) {
        this.system = system;
    }

    @render(gc.JoinGame.JoinGameStore, (store) => store.signedIn, { fireImmediately: false })
    requestOpenMiniGame() {
        if (settings?.isMiniGame) {
            this.openGameCallback();
        }
    }
}
