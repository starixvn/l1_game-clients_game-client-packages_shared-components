import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { JackpotNotification } from "./jackpot-notification";

const { render } = Observer;
const { Notification, Translator } = gc;
const { ccclass } = _decorator;

@ccclass("JackpotNotificationContainer")
export class JackpotNotificationContainer extends NodeContainer {
    private jackpotInfo: gc.NotificationServiceMessage.JackpotWinner = null;

    onLoad(): void {
        super.onLoad();
        window.addEventListener("message", this.registerEventGetGameName.bind(this));
    }

    protected onDestroy(): void {
        super.onDestroy();
        window.removeEventListener("message", this.registerEventGetGameName.bind(this));
    }

    registerEventGetGameName(event: MessageEvent) {
        const { gameName, gameId } = event.data;
        if (gameName !== undefined && this.jackpotInfo?.gameId === gameId) {
            const node = this.createNode();
            const jackpotNotificationCmp = node.getComponent(JackpotNotification);
            jackpotNotificationCmp.setData(this.jackpotInfo.winnerName, this.jackpotInfo.amount, gameName);
            this.jackpotInfo = null;
        }
    }

    @render(Notification.JackpotWinnerStore, (store) => store.jackpotWinner, { fireImmediately: false })
    showNotification(jackpotInfo: gc.NotificationServiceMessage.JackpotWinner) {
        this.jackpotInfo = jackpotInfo;
        gc.BrowserDomUtils.postMessageToParent({ getGameName: jackpotInfo.gameId, language: Translator.getCurrentLanguageId() });
    }
}
