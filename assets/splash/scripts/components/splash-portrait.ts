import { _decorator, ProgressBar } from "cc";
import AutoTestSplash from "db://shared-components/shared/common-components/auto-test/auto-test-splash";
import Observer from "observer";
import Splash from "./splash";

const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass
export default class SplashPortrait extends Splash {
    onLoad() {
        super.onLoad();
        this.addComponent(AutoTestSplash);
    }

    handleProgressIndex(progress: number) {
        super.handleProgressIndex(progress);
        if (progress > 0) {
            const progressBar = this.containerCustomize.getComponentInChildren(ProgressBar);
            progressBar && (progressBar.progress = progress);
        }
    }
}
