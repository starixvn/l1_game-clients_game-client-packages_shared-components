import Splash from "../../splash/scripts/components/splash";
import { _decorator } from "cc";
import MultiplayGameConnection from "../common-components/multiplay-game-connection";

const { ccclass } = _decorator;

@ccclass("MultiplayGameSplash")
export default class MultiplayGameSplash extends Splash {
    gameConnections: MultiplayGameConnection[] = [];

    override initGameConnectionComponent() {
        this.gameConnections = this.getComponents(MultiplayGameConnection);
        this.gameConnections[0] && (this.gameConnections[0].openGameCallback = () => this.loadSceneGame());
    }

    override connectToGameService() {
        this.gameConnections.forEach((gameConnection) => {
            gameConnection.connectToService();
        });
    }
}
