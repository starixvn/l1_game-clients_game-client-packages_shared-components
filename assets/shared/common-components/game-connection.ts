import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./observer-component/scripts/observer-component";

const { ccclass } = _decorator;
const { handle, render } = Observer;

const { Auth, AppTypes } = gc;

@ccclass
export default class GameConnection extends ObserverComponent {
    protected system: number = AppTypes.Club;
    protected isMiniGame: boolean = false;
    openGameCallback = () => {};

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.JoinGame.JoinGameStore, (store) => store.toGame, { fireImmediately: false })
    requestOpenGame() {
        this.openGameCallback();
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.startNewRound, { fireImmediately: false })
    requestOpenGameWhenStartNewRound() {
        if (this.system === AppTypes.Instant) {
            this.openGameCallback();
        }
    }

    @render(Auth.AuthStore, (store) => store.system)
    openGame(system: number) {
        this.system = system;
    }
 
    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.isMiniGame)
    setMiniGame(isMiniGame: boolean) {
        this.isMiniGame = isMiniGame;
    }

    @render(gc.JoinGame.JoinGameStore, (store) => store.signedIn, { fireImmediately: false })
    requestOpenMiniGame() {
        if (this.isMiniGame) {
            this.openGameCallback();
        }
    }
}
