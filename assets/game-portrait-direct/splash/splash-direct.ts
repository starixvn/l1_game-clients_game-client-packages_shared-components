import gc from "@sg/game-client-base";
import { _decorator, Component, director, Label } from "cc";
import Observer from "observer";

import GameConnection from "../../shared/common-components/game-connection";
import { ErrorMessage } from "../../splash/scripts/error-message";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, ChipSetting, sentryLogger, Configs, Translator, BrowserDomUtils, App, AppTypes } = gc;

@ccclass
@observer
export default class Splash extends Component {
    @property(ErrorMessage)
    cpnMessage: ErrorMessage = null;

    @property(Label)
    percentResourceLoad: Label = null;

    gameConnection: GameConnection = null;

    protected system: number = AppTypes.Club;

    onLoad() {
        gc.initMobxLogger();
        this.initGameConnectionComponent();
        this.updateProgressBar(0);
        this.sso();
        window.addEventListener("message", this.registerEvents);
    }

    onDestroy(): void {
        window.removeEventListener("message", this.registerEvents);
    }

    protected onEnable(): void {
        BrowserDomUtils.postMessageToParent({ splashEnabled: true });
    }

    protected registerEvents = (event: MessageEvent) => {
        this.removeUserSetting(event);
        this.registerEventUserGesturePage(event);
    };

    removeUserSetting(event: MessageEvent) {
        if (event?.data?.isClearStorage) {
            this.handleClearStorage();
        }
    }

    @handle(App.AppHandlers.ClearStorage)
    handleClearStorage() {
        return true;
    }

    @handle(App.AppHandlers.UserGesturePage)
    protected registerEventUserGesturePage(event: MessageEvent) {
        return event.data?.isUserGesture || false;
    }

    private initGameConnectionComponent() {
        this.gameConnection = this.getComponent(GameConnection);
        if (this.gameConnection) {
            this.gameConnection.openGameCallback = () => this.loadSceneGame();
        }
    }

    @handle(Auth.AuthHandlers.SSO)
    sso() {
        return new URLSearchParams(window.location.search);
    }

    @render(Auth.AuthStore, (store) => ({
        isAuthorized: store.isAuthorized,
        system: store.system,
    }))
    openGame({ isAuthorized, system }) {
        if (isAuthorized) {
            this.system = system;
            this.loadChipSetting();
            this.triggerRecheckIn();
            this.connectToGameService();
        }
    }

    connectToGameService() {
        this.gameConnection?.connectToService();
    }

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage, { fireImmediately: false })
    renderMessage(message: string) {
        this.cpnMessage.reset();
        this.cpnMessage.setMessage(message);
    }

    updateProgressBar(progress: number) {
        console.log("progress", progress);
        localStorage.setItem("loading", progress.toString());
    }

    loadSceneGame() {
        const sceneName = this.sceneName;
        director.preloadScene(
            sceneName,
            (completedCount: number, totalCount: number) => {
                this.updateProgressBar(completedCount / totalCount);
            },
            (error) => {
                if (error) {
                    sentryLogger.logError(error);
                } else {
                    director.loadScene(sceneName);
                }
            }
        );
    }

    get sceneName() {
        return "game";
    }

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(ChipSetting.ChipSettingHandler)
    loadChipSetting() {}

    @render(Auth.AuthStore, (store) => store.isShowSignName, { fireImmediately: false })
    handleShowSignName(isShowSignName: boolean) {
        this.updateContentUnderBackground(!isShowSignName);
    }

    private updateContentUnderBackground(status: boolean) {
        this.cpnMessage && (this.cpnMessage.node.active = status);
    }
}
