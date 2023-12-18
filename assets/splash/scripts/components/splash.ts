import gc from "@sg/game-client-base";
import { _decorator, Component, director, instantiate, Label, Node, Prefab, ProgressBar } from "cc";
import Observer from "observer";

import { bundleManager } from "../../../shared/common-components/bundle-magager/bundle-manager";
import GameConnection from "../../../shared/common-components/game-connection";
import { ComponentUtils, FunctionUtils } from "../../../shared/utils";
import { ErrorMessage } from "../error-message";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, ChipSetting, StorageManager, sentryLogger, Configs, Translator, BrowserDomUtils, App, AppTypes } = gc;

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

    protected system: number = AppTypes.Club;

    onLoad() {
        gc.initMobxLogger();
        this.initGameConnectionComponent();
        this.updateProgressBar(0);
        this.sso();
        this.gameName && (this.gameName.string = Translator.gameTranslate("game_name").toUpperCase());
        ComponentUtils.addChildFromPrefab(this.prefabCustomize, this.containerCustomize);
        window.addEventListener("message", this.registerEvents.bind(this));
    }

    onDestroy(): void {
        window.removeEventListener("message", this.registerEventUserGesturePage.bind(this));
    }

    protected onEnable(): void {
        BrowserDomUtils.postMessageToParent({ splashEnabled: true });
    }

    protected registerEvents(event: MessageEvent) {
        this.removeUserSetting(event);
        this.registerEventUserGesturePage(event);
    }

    removeUserSetting(event) {
        console.log("removeUserSetting", event);
        if (event?.data?.isClearUserSetting) {
            StorageManager.remove(gc.Shared.utils.localStorageKeys.userSetting);
        }
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
        this.gameName && (this.gameName.node.active = false);
    }

    updateProgressBar(progress: number) {
        if (this.progressBar) {
            this.gameName && (this.gameName.node.active = true);
            this.percentResourceLoad.string = `${Math.round(progress * 100)}%`;
            this.progressBar.progress = progress;
        }
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
        if (this.system === AppTypes.Instant) {
            return FunctionUtils.isPortraitMode() ? "game-instant-portrait" : "game-instant-landscape";
        }

        return "game";
    }

    @render(Configs.SiteConfigs, (store) => store.systemType)
    async showSystemSlogan(systemType: string) {
        const isSystemSG = systemType === Configs.SystemConfigs.SG.name;
        const assetPath = isSystemSG ? "logo-SG" : "logo-VG";
        await this.loadSystemSlogan(assetPath, isSystemSG);
    }

    async loadSystemSlogan(assetPath: string, isSystemSG: boolean) {
        this.destroyAllChildrenSlogan();
        const slogan = await bundleManager.loadSharedAsset<Prefab>(`splash/${assetPath}`, Prefab, null);
        if (slogan && this?.node?.isValid) {
            const sloganNode = instantiate(slogan);
            if (isSystemSG) {
                this.nodeSloganSG.addChild(sloganNode);
            } else {
                this.nodeSloganVG.addChild(sloganNode);
            }
        }
    }

    destroyAllChildrenSlogan() {
        this.nodeSloganSG.destroyAllChildren();
        this.nodeSloganVG.destroyAllChildren();
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
        this.signNameContainer && (this.signNameContainer.active = isActive);
    }

    private updateContentUnderBackground(status: boolean) {
        this.progressBar.node.active = status;
        this.cpnMessage.node.active = status;
    }
}
