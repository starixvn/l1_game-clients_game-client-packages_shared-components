import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Prefab } from "cc";
import { Socket } from "socket.io-client/dist/socket.io.js";
import { siteConfigs } from "../../../../../../assets/scripts/site-configs";
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

@ccclass("GatewayDataReceiver")
export class GatewayDataReceiver extends Component {
    @property(Prefab)
    panelPrefab: Prefab = null;

    socket: Socket = null;

    gatewayConfig = {
        gameId: 102,
        games: {
            // "10": ["classic"],
            "27": ["classic"],
            "48": ["classic"],
            "81": ["lucky"],
            "82": ["lucky"],
            "83": ["lucky"],
            "88": ["lucky"],
            "89": ["lucky"],
            // "84": ["classic"],
            "85": ["classic"],
            "86": ["classic"],
            "87": ["classic"],
            "90": ["classic"],
            "91": ["classic"],
            "92": ["classic"],
            "97": ["classic"],
            "98": ["speed"],
            "100": ["speed"],
            "101": ["speed"],
        },
        durations: {
            default: {
                value: {
                    wholeRound: 47,
                    wholeShoe: 65,
                    lockingBet: 3,
                    placingBet: 30,
                    generatingResult: 7,
                    showingResult: 5,
                    startRound: 4,
                },
            },
            speed: {
                ids: [98, 100, 101],
                value: {
                    wholeRound: 33,
                    wholeShoe: 51,
                    lockingBet: 3,
                    placingBet: 20,
                    generatingResult: 4,
                    showingResult: 5,
                    startRound: 3,
                },
            },
            blockchain: {
                ids: [48],
                value: {
                    wholeRound: 58,
                    wholeShoe: 48,
                    lockingBet: 3,
                    placingBet: 30,
                    generatingResult: 4,
                    showingResult: 5,
                    startRound: 3,
                },
            },
        },
        serviceName: {
            default: {
                value: "baccaratx",
            },
            old: {
                value: "",
                ids: [10, 27],
            },
            blockchain: {
                value: "blockchain-baccarat",
                ids: [48],
            },
        },
        receivedEvents: [
            "roundHistory",
            "remainingTime",
            "rtp",
            "betLimit",
            "finish",
            "totalOnlineUsers",
            "player",
            "outgame",
            "newShoePhase",
            "newShoeHash",
            "um",
            "um_message",
            "errorCode",
            "newBlockchain",
        ],
    };

    rtps = [];
    dataGames = {};

    onLoad() {
        this.createGameDatas();

        const socketUri = gc.UrlUtils.buildUrlFromSubDomain(siteConfigs, siteConfigs?.gatewaySubDomain);
        this.socket = gc.SocketUtils.createSocket(socketUri, siteConfigs);
        this.socket.on("connect", () => {
            console.log("gateway socket connected");
            this.socket.onAny(this.filterDataGame);
            this.sendSignInAllGames();
        });
    }

    getFilterGames() {
        const games = Object.keys(this.gatewayConfig.games).map((gameId) => +gameId);
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
        const info = this.gatewayConfig.serviceName;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getDurations(gameId: number) {
        const info = this.gatewayConfig.durations;
        const type = Object.keys(info).find((key) => info[key].ids?.includes(gameId)) ?? "default";
        return info[type].value;
    }

    getCategory(gameId: number) {
        return this.gatewayConfig.games[gameId];
    }

    sendSignInEachGame(gameId: number) {
        const data = {
            gameName: this.getGameName(gameId),
            receivedEvents: this.gatewayConfig.receivedEvents,
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
        games.forEach((gameId) => {
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
