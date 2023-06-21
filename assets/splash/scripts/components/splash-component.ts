import gc from "@sg/game-client-base";
import { Component, Node, ProgressBar, _decorator, director } from "cc";
import Observer from "observer";
import { RandomWaitingMessage } from "../random-waiting-message";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, App, Chips, sentryLogger, Configs } = gc;

@ccclass
@observer
export default class Splash extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(RandomWaitingMessage)
    cpnMessage: RandomWaitingMessage = null;

    @property(Node)
    nodeSloganSC1: Node = null;

    @property(Node)
    nodeSloganSC2: Node = null;

    onLoad() {
        this.updateProgressBar(0);
        this.sso();
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
            this.loadSceneGame();
        }
    }

    @render(App.AppStore, (store) => store.isUM)
    openUnderMaintenanceScreen(isUM: boolean) {
        isUM && director.loadScene("under-maintenance");
    }

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage, { fireImmediately: false })
    renderMessage(message: string) {
        this.cpnMessage.reset();
        this.cpnMessage.setMessage(message);
    }

    updateProgressBar(progress: number) {
        this.progressBar && (this.progressBar.progress = progress);
    }

    loadSceneGame() {
        const screenName = "game";
        director.preloadScene(
            screenName,
            (completedCount: number, totalCount: number) => {
                this.updateProgressBar(completedCount / totalCount);
            },
            (error) => {
                if (error) {
                    sentryLogger.logError(error);
                } else {
                    director.loadScene(screenName);
                }
            }
        );
    }

    @render(Configs.SiteConfigs, (store) => store.systemType)
    showSystemSlogan(systemType: string) {
        const isSystemSC1 = systemType === "SC1";
        this.nodeSloganSC1.active = isSystemSC1;
        this.nodeSloganSC2.active = !isSystemSC1;
    }

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(Chips.ChipSettingHandler)
    loadChipSetting() {}
}
