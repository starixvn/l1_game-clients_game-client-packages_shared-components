import { Node, WebView, _decorator, tween } from "cc";
import gc from "game-client-base";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { UrlUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass
export default class LoadWebView extends ObserverComponent {
    @property(WebView)
    webView: WebView = null;

    @property(Node)
    nodeLoading: Node = null;

    protected url: string = "";
    protected onWebViewLoaded = () => {};

    onLoad(): void {
        super.onLoad();
        this.webView.node.on(
            "loaded",
            () => {
                const paddingTime = 0.3;
                tween(this.node)
                    .delay(paddingTime)
                    .call(() => {
                        this.hideLoading();
                        this.showWebView();
                    })
                    .start();
            },
            this
        );
    }

    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.webView.url = this.url;
        }
    }

    showWebView() {
        this.webView.onEnable();
        this.onWebViewLoaded();
    }

    hideWebView() {
        this.webView.onDisable();
    }

    destroyDivIframe() {
        this.webView.onDestroy();
    }

    showLoading() {
        this.nodeLoading.active = true;
    }

    hideLoading() {
        this.nodeLoading.active = false;
    }
}
