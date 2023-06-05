import { _decorator } from "cc";
import gc from "game-client-base";
import Observer from "observer";
import LoadWebView from "../../../common/web-view/load-web-view";

const { GameGuide, GameConfigs, UrlUtils } = gc;
const { handle, render } = Observer;
const { ccclass } = _decorator;

@ccclass
export default class WebViewGuide extends LoadWebView {
    private gameConfig: gc.GameConfigs.GameConfigStore;

    @handle(GameGuide.GameGuideHandlers.GetGuideURL)
    initUrl(specialDirection = "") {
        const theme = "blue";
        return { theme, specialDirection };
    }

    @render(GameConfigs.GameConfigStore, (store) => store)
    setGameConfigs(gameConfigs: gc.GameConfigs.GameConfigStore) {
        this.gameConfig = gameConfigs;
    }

    sendDataToIframe(gameConfigs: gc.GameConfigs.GameConfigStore) {
        const guideUrl = UrlUtils.getSubDomain(this.url);
        this.onWebViewLoaded = () => {
            (document.getElementById("webview") as HTMLIFrameElement)?.contentWindow?.postMessage(JSON.stringify(gameConfigs), guideUrl);
        };
    }

    @render(GameGuide.GameGuideStore, (store) => store.url)
    loadGameGuide(url: string) {
        if (url) {
            this.url = url;
            this.sendDataToIframe(this.gameConfig);
            this.loadWebView();
        }
    }

    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.hideWebView();

            this.webView.url = this.url;
        }
    }
}
