import { _decorator, Component, director, ProgressBar } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, App, Chips, sentryLogger } = gc;

@ccclass
@observer
export default class Splash extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

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

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {}

    @handle(Chips.ChipSettingHandler)
    loadChipSetting() {}
}
