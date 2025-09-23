import { _decorator, ProgressBar } from "cc";
import Observer from "observer";

import SplashComponentBase from "./splash-component-base";

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass
@observer
export default class SplashOriginal extends SplashComponentBase {
    @property(ProgressBar)
    progressBar: ProgressBar = null;

    onLoad() {
        super.onLoad();
        this.updateProgressBar(0);
    }

    updateProgressBar(progress: number) {
        if (this.percentResourceLoad) {
            if (progress >= this.progress) {
                this.percentResourceLoad.string = `${Math.round(progress * 100)}%`;
                this.progress = progress;
                this.progressBar.progress = progress;
            }
        }
    }
}
