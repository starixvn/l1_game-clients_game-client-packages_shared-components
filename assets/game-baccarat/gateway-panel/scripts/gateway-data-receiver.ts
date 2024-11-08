import gc from "@sg/game-client-base";
import { _decorator, instantiate, JsonAsset, log, Prefab, warn } from "cc";
import Observer from "observer";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { siteConfigs } from "../../../../../../assets/scripts/site-configs";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
import { GatewayPanel } from "./gateway-panel";
import { DisableGameHandler } from "./handlers/disable-game-handler";
import { GameInfoHandler } from "./handlers/game-info-handler";
import { RoundHistoryHandler } from "./handlers/round-history-handler";
import { EmitterEvents } from "./models/definitions";
import { DisableGameStore } from "./models/disable-game-store";
import { GameData } from "./models/game-data";
import { GameInfoStore } from "./models/game-info-store";
import { RoundHistoryStore } from "./models/round-history-store";
const { ccclass, property } = _decorator;
const { render } = Observer;

interface IGatewayConfigs {
    gameId: number;
    games: Record<number, string[]>;
    durations: {
        default: IDurationDetails;
        speed: IDurationDetailsWithIds;
        blockchain: IDurationDetailsWithIds;
    };
    serviceName: {
        default: IServiceNameDetails;
        old: IServiceNameDetailsWithIds;
        blockchain: IServiceNameDetailsWithIds;
    };
    receivedEvents: string[];
}

interface IDurationDetails {
    value: IDurationValues;
}

interface IDurationDetailsWithIds extends IDurationDetails {
    ids: number[];
}

interface IDurationValues {
    wholeRound: number;
    wholeShoe: number;
    lockingBet: number;
    placingBet: number;
    generatingResult: number;
    showingResult: number;
    startRound: number;
}

interface IServiceNameDetails {
    value: string;
}

interface IServiceNameDetailsWithIds extends IServiceNameDetails {
    ids: number[];
}

const DEFAULT_PATH_CONFIG_GATEWAY = "/gateway/102/info.json";
@ccclass("GatewayDataReceiver")
export class GatewayDataReceiver extends ObserverComponent {
    @property(Prefab)
    panelPrefab: Prefab = null;

    socket: Socket = null;

    gatewayConfig: IGatewayConfigs = null;

    rtps = [];
    dataGames = {};
    gameId = -1;
    offerGames = [];

    onLoad() {
        super.onLoad();
        this.getGatewayConfig().then(() => {
            this.createGameDatas();

            const socketUri = gc.UrlUtils.buildUrlFromSubDomain(siteConfigs, siteConfigs?.gatewaySubDomain);
            this.socket = gc.SocketUtils.createSocket(socketUri, siteConfigs);
            this.socket.on("connect", () => {
                console.log("gateway socket connected");
                this.socket.onAny(this.filterDataGame);
                this.sendSignInAllGames();
            });
        });
    }

    async getGatewayConfig() {
        try {
            const configUrl = `${gc.UrlUtils.buildShareResource(siteConfigs)}${DEFAULT_PATH_CONFIG_GATEWAY}?v=${Date.now()}`;
            const jsonAsset = (await FunctionUtils.loadRemote(configUrl)) as JsonAsset;
            this.gatewayConfig = (jsonAsset?.json as IGatewayConfigs) ?? null;
        } catch (error) {
            log("Get Gateway config failed!");
        }
    }

    @render(gc.GameConfigs.GameSetting, (store) => store.id)
    renderGameId(gameId: number) {
        this.gameId = gameId;
    }

    @render(gc.Player.MainPlayerStore, (store) => store.offerGames)
    renderOfferGames(offerGames: number[]) {
        if (offerGames) {
            this.offerGames = Object.keys(offerGames).map((id) => +id);
        }
    }

    getFilterGames() {
        if (this.offerGames.length === 0) {
            warn("offerGames is empty!");
            return [];
        }
        const games = Object.keys(this.gatewayConfig?.games)
            .map((gameId) => +gameId)
            .filter((gameId) => gameId !== this.gameId && this.offerGames.includes(gameId));
        return games;
    }

    createGameDatas() {
        const games = this.getFilterGames();
        games.forEach((gameId) => {
            const gameName = this.getGameName(gameId).toLowerCase();
            this.dataGames[gameName] = this.createGameData(gameId);
        });
    }

    createGameData(gameId: number) {
        const durations = this.getDurations(gameId);
        const gameData = new GameData();
        gameData.initHandlers([RoundHistoryHandler, GameInfoHandler, DisableGameHandler]);

        const infoStore = new GameInfoStore();
        infoStore.durations = durations;
        const disableGameStore = new DisableGameStore();
        disableGameStore.addListener(EmitterEvents.GetLobbyData, () => this.sendSignInEachGame(gameId));
        gameData.addStores([new RoundHistoryStore(), infoStore, disableGameStore]);
        return gameData;
    }

    filterDataGame = (event: string, data: any) => {
        const eventLowerCase = event.toLocaleLowerCase();

        if (eventLowerCase === "message") {
            const gameName = data.gameName?.toLocaleLowerCase();
            this.onData(data, gameName);
        } else {
            this.onData(data, eventLowerCase);
        }
    };

    onData(data: any, gameName: string) {
        if (data.signedIn) {
            this.onSignedIn(gameName);
            return;
        }
        this.handleDataRtp(data, gameName);
        this.publisDataEachGame(data, gameName);
    }

    publisDataEachGame(data: any, gameName: string) {
        const gameData = this.dataGames[gameName];
        if (gameData) {
            gameData.receiveData(data);
        }
    }

    handleDataRtp(data: any, gameName: string) {
        if (data.rtp) {
            this.rtps.push({
                gameName: gameName,
                rtp: data.rtp,
            });

            this.rtps.sort((a, b) => b.rtp - a.rtp);
        }
    }

    sendSignInAllGames() {
        const games = this.getFilterGames();
        console.log("sendSignInAllGames:", games);
        games.forEach((gameId) => {
            this.sendSignInEachGame(+gameId);
        });
    }

    getGameName(gameId: number) {
        if (gameId === 27) {
            return "VipBaccarat";
        }
        if (gameId === 48) {
            return "BlockchainBaccarat";
        }
        return `Bac${gameId}`;
    }

    getSession() {
        const sessionStorage = gc.StorageManager.get(gc.localStorageKeys.session) as any;
        return sessionStorage
            ? {
                  ss: sessionStorage.session,
                  username: sessionStorage.username,
                  system: sessionStorage.system,
              }
            : {};
    }

    getServiceName(gameId: number) {
        const info = this.gatewayConfig?.serviceName;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getDurations(gameId: number) {
        const info = this.gatewayConfig?.durations;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getCategory(gameId: number) {
        return this.gatewayConfig?.games[gameId];
    }

    sendSignInEachGame(gameId: number) {
        const data = {
            gameName: this.getGameName(gameId),
            receivedEvents: this.gatewayConfig?.receivedEvents,
            session: this.getSession(),
        };
        const serviceName = this.getServiceName(gameId);
        if (serviceName !== "") {
            data["serviceName"] = serviceName;
        }
        this.socket.emit("signIn", data);
    }

    onSignedIn(gameName: string) {
        this.getLobbyData(gameName);
    }

    getLobbyData(gameName: string) {
        this.socket.emit("getLobbyData", { gameName: gameName });
    }

    onOpenSidePanel() {
        const node = instantiate(this.panelPrefab);
        this.node.addChild(node);

        const panel = node.getComponent(GatewayPanel);

        const games = this.getFilterGames();
        const info = {};
        games?.forEach((gameId) => {
            const gameName = this.getGameName(gameId);
            info[gameId] = {
                gameName,
                gameData: this.dataGames[gameName.toLowerCase()],
                categories: this.getCategory(gameId),
            };
        });

        panel.initItems(info);
    }
}
