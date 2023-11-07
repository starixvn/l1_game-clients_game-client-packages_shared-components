import gc from "@sg/game-client-base";
import { CCString, _decorator } from "cc";
import Observer from "observer";
import GameConnection from "../../shared/common-components/game-connection";

const { ccclass, property } = _decorator;
const { handle, render, useObserver } = Observer;

const { UrlUtils, GameConfigs } = gc;

@ccclass("MultiplayGameConnection")
export default class MultiplayGameConnection extends GameConnection {
    @property(CCString)
    namespace = "";

    protected gameId = 0;

    onLoad(): void {
        this.dispose = useObserver(this, this.namespace.toLowerCase());
    }

    @render(GameConfigs.GameSetting, (store) => store.id)
    setGameId(gameId: number) {
        this.gameId = gameId;
    }

    connectToService() {
        const socketUri = UrlUtils.buildServerUrl("http", `${this.namespace.toLowerCase()}`, this.gameId, window.envConfig);
        return { socketUri, forceNew: false };
    }
}
