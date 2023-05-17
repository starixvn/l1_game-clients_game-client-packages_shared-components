import { _decorator, Component, director } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { render, handle, observer } = Observer;

const { ConnectSite, App } = gc;

const { ccclass } = _decorator;
@ccclass
@observer
export default class SessionTimeOutVisibility extends Component {
    @render(App.AppStore, (store) => ({ isSessionTimeout: store.isSessionTimeout, isApp: store.isApp }))
    redirectToSessionTimeoutPage({ isSessionTimeout, isApp }: { isSessionTimeout: boolean; isApp: boolean }) {
        if (isSessionTimeout) {
            if (isApp) {
                this.redirectToAppTimeoutPage();
            } else {
                director.loadScene("session-timeout");
            }
        }
    }

    @handle(ConnectSite.ConnectSiteHandlers.RedirectToTimeoutPage)
    redirectToAppTimeoutPage() {}
}
