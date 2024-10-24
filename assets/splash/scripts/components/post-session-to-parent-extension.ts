import { _decorator, Component } from "cc";
const { ccclass } = _decorator;
import Observer from "observer";
const { observer, render } = Observer;
import gc from "@sg/game-client-base";
const { Auth, BrowserDomUtils, Shared } = gc;

@ccclass
@observer
export default class SplashExtension extends Component {
    @render(Auth.AuthStore, (store) => ({
        isAuthorized: store.isAuthorized,
        system: store.system,
    }))
    openGame({ isAuthorized, system }) {
        if (isAuthorized) {
            const sessionInfo = Shared.utils.StorageManager.get(Shared.utils.localStorageKeys.session);
            console.log("render in child", sessionInfo);
            //window.parent.postMessage({ sessionInfo }, "*"); // '*' allows any origin, or you can specify the parent origin.
            BrowserDomUtils.postMessageToParent({ sessionInfo });
        }
    }
}
