import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";
import { Socket } from "socket.io-client";
import { DisableGameHandler } from "./handlers/disable-game-handler";
import { GameInfoHandler } from "./handlers/game-info-handler";
import { RoundHistoryHandler } from "./handlers/round-history-handler";
import { EmitterEvents, Store } from "./models/definitions";
import { DisableGameStore } from "./models/disable-game-store";
import { Durations } from "./models/durations-interface";
import { GameData } from "./models/game-data";
import { GameInfoStore } from "./models/game-info-store";
import { RoundHistoryStore } from "./models/round-history-store";
import RenderItem from "./render-item/render-item";
const { ccclass, property } = _decorator;
@ccclass
export default class GatewayGameItem extends Component {
    @property(Label)
    labelGameName: Label = null;

    @property(Node)
    loading: Node = null;

    renderItems: RenderItem[] = [];
    gameId = 0;
    serviceName = "";
    socket: Socket;
    gameData: GameData = null;
    receivedEvents: string[];
    gameName = "";

    initRenderItems() {
        this.renderItems = this.getComponentsInChildren(RenderItem);
        this.renderItems.forEach((item) => item.init(this.gameData));
    }

    init(settings: { gameId: number; gameName: string; serviceName: string; socket: Socket; durations: Durations }) {
        const { gameId, gameName, serviceName, socket, durations } = settings;
        this.gameId = gameId;
        this.gameName = gameName;
        this.serviceName = serviceName;
        this.socket = socket;
        this.updateGameName(this.gameId);
        this.initGameData(durations);
        this.initUIListeners();
    }

    initUIListeners() {
        // uiManager.emitterListener(
        //     InternalEvents.GATEWAY_OPEN_GAME,
        //     (gameId) => {
        //         this.loading.active = gameId === this.gameId;
        //     },
        //     this
        // );
    }

    onDestroy() {
        // uiManager.removeListenersWithTarget(this);
        const disableGameStore = this.gameData.getStore(Store.DisableGame) as DisableGameStore;
        disableGameStore.clearIntervalGetLobbyData();
        this.removeSocketListeners();
        this.gameData = null;
    }

    removeSocketListeners() {
        if (!this.socket) {
            return;
        }
        this.socket.removeAllListeners();
        this.socket = null;
    }

    getDisplayName() {
        return gc.Translator.translate(`${this.gameName}.game_name`);
    }

    async updateGameName(gameId: number) {
        try {
            this.labelGameName.string = this.getDisplayName();
            if (this.labelGameName.string === "") {
                this.labelGameName.string = `Game___${gameId}`;
            }
        } catch (e) {}
    }

    setReceiveEvents(receivedEvents: string[]) {
        this.receivedEvents = receivedEvents;
        this.sendSignIn();
    }

    resetGameData() {
        this.gameData.reset();
    }

    sendSignIn() {
        // const data = {
        //     gameName: this.gameName,
        //     receivedEvents: this.receivedEvents,
        //     session: getSession(),
        // };
        // if (this.serviceName !== "") {
        //     data["serviceName"] = this.serviceName;
        // }
        // this.socket.emit("signIn", data);
    }

    initGameData(durations: Durations) {
        this.gameData = new GameData();
        this.gameData.initHandlers([RoundHistoryHandler, GameInfoHandler, DisableGameHandler]);

        const infoStore = new GameInfoStore();
        infoStore.durations = durations;
        const disableGameStore = new DisableGameStore();
        disableGameStore.addListener(EmitterEvents.GetLobbyData, this.sendSignIn.bind(this));
        this.gameData.addStores([new RoundHistoryStore(), infoStore, disableGameStore]);
        this.initRenderItems();
    }

    filterDataGame = (event: string, data: any) => {
        const eventLowerCase = event.toLocaleLowerCase();
        const gameName = this.gameName.toLocaleLowerCase();
        if (eventLowerCase === gameName || (eventLowerCase === "message" && data.gameName?.toLocaleLowerCase() === gameName)) {
            this.onData(data);
        }
    };

    onReconnectGame() {
        this.sendSignIn();
    }

    getLobbyData() {
        this.socket.emit("getLobbyData", { gameName: this.gameName });
    }

    onData(data: any) {
        if (data.signedIn) {
            this.onSignedIn();
            return;
        }
        this.gameData.receiveData(data);
    }

    onSignedIn() {
        this.getLobbyData();
    }

    onClickOpenGame() {
        // uiManager.emitter.emit(InternalEvents.GATEWAY_OPEN_GAME, this.gameId);
    }
}
