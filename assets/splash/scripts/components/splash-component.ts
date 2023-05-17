import { _decorator, Component, director, ProgressBar } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, Shared, App, Chips } = gc;

export const AppTypes = {
    Club: 1,
    App: 5,
};

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
        const urlParams = new URLSearchParams(window.location.search);
        return { urlParams, system: AppTypes.Club };
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
                    console.log(error);
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
