import gc from "@sg/game-client-base";
import { Component, Label, Node, Prefab, ProgressBar, _decorator, director } from "cc";
import Observer from "observer";
import GameConnection from "../../../shared/common-components/game-connection";
import { ComponentUtils } from "../../../shared/utils";
import { ErrorMessage } from "../error-message";
const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, App, Chips, sentryLogger } = gc;
@ccclass
@observer
export default class Splash extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(ErrorMessage)
    cpnMessage: ErrorMessage = null;

    @property(Node)
    signNameContainer: Node = null;

    @property(Node)
    gameName: Node = null;

    @property(Label)
    percentResourceLoad: Label = null;

    @property(Node)
    containerCustomize: Node = null;

    @property(Prefab)
    prefabCustomize: Prefab = null;

    gameConnection: GameConnection = null;

    onLoad() {
        gc.initMobxLogger();
        this.initGameConnectionComponent();
        this.updateProgressBar(0);
        this.sso();
        ComponentUtils.addChildFromPrefab(this.prefabCustomize, this.containerCustomize);
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

    @render(Auth.AuthStore, (store) => store.isAuthorized)
    openGame(isAuthorized: boolean) {
        if (isAuthorized) {
            this.loadChipSetting();
            this.triggerRecheckIn();
            this.connectToGameService();
        }
    }

    connectToGameService() {
        this.gameConnection?.connectToService();
    }

    @render(App.AppStore, (store) => store.isUM)
    openUnderMaintenanceScreen(isUM: boolean) {
        isUM && director.loadScene("under-maintenance");
    }

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage, { fireImmediately: false })
    renderMessage(message: string) {
        this.cpnMessage.reset();
        this.cpnMessage.setMessage(message);
        this.gameName.active = false;
    }

    updateProgressBar(progress: number) {
        if (this.progressBar) {
            this.gameName.active = true;
            this.percentResourceLoad.string = `${Math.round(progress * 100)}%`;
            this.progressBar.progress = progress;
        }
    }

    loadSceneGame() {
        const sceneName = "game";
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

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(Chips.ChipSettingHandler)
    loadChipSetting() {}

    @render(Auth.AuthStore, (store) => store.isShowSignName, { fireImmediately: false })
    handleShowSignName(isShowSignName: boolean) {
        this.toggleSignNameContainer(isShowSignName);
        this.updateContentUnderBackground(!isShowSignName);
    }

    private toggleSignNameContainer(isActive: boolean) {
        this.signNameContainer.active = isActive;
    }

    private updateContentUnderBackground(status: boolean) {
        this.progressBar.node.active = status;
        this.cpnMessage.node.active = status;
    }
}
