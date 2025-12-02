import gc from "@sg/game-client-base";
import { _decorator, ProgressBar } from "cc";
import SplashComponentBase from "db://shared-components/splash/scripts/components/splash-component-base";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { Auth, AppTypes } = gc;

@ccclass
@observer
export default class SplashOriginalPortrait extends SplashComponentBase {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    onLoad() {
        super.onLoad();
        this.updateProgressBar(0);
    }

    start() {
    }

    override updateProgressBar(progress: number): void {
        super.updateProgressBar(progress);
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
    }
}
