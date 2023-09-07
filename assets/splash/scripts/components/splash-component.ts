import gc from "@sg/game-client-base";
import { Component, Label, Node, Prefab, ProgressBar, _decorator, director } from "cc";
import Observer from "observer";
import GameConnection from "../../../shared/common-components/game-connection";
import { ComponentUtils } from "../../../shared/utils";
import { ErrorMessage } from "../error-message";
const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, ChipSetting, sentryLogger, Configs, Translator, BrowserDomUtils, App } = gc;

@ccclass
@observer
export default class Splash extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(ErrorMessage)
    cpnMessage: ErrorMessage = null;

    @property(Node)
    nodeSloganSG: Node = null;

    @property(Node)
    nodeSloganVG: Node = null;

    @property(Node)
    signNameContainer: Node = null;

    @property(Label)
    gameName: Label = null;

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
        this.gameName.string = Translator.gameTranslate("game_name").toUpperCase();
        ComponentUtils.addChildFromPrefab(this.prefabCustomize, this.containerCustomize);
        window.addEventListener("message", this.registerEventUserGesturePage.bind(this));
    }

    onDestroy(): void {
        window.removeEventListener("message", this.registerEventUserGesturePage.bind(this));
    }

    protected onEnable(): void {
        BrowserDomUtils.postMessageToParent({ splashEnabled: true });
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

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage, { fireImmediately: false })
    renderMessage(message: string) {
        this.cpnMessage.reset();
        this.cpnMessage.setMessage(message);
        this.gameName.node.active = false;
    }

    updateProgressBar(progress: number) {
        if (this.progressBar) {
            this.gameName.node.active = true;
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

    @render(Configs.SiteConfigs, (store) => store.systemType)
    showSystemSlogan(systemType: string) {
        const isSystemSG = systemType === Configs.SystemConfigs.SG.name;
        this.nodeSloganSG.active = isSystemSG;
        this.nodeSloganVG.active = !isSystemSG;
    }

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(ChipSetting.ChipSettingHandler)
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
