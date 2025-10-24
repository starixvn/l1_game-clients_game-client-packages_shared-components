import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { JackpotNotification } from "./jackpot-notification";
import { FunctionUtils } from "../../../shared/utils/function-utils";

const { render } = Observer;
const { Notification, Translator } = gc;
const { ccclass } = _decorator;

@ccclass("JackpotNotificationContainer")
export class JackpotNotificationContainer extends NodeContainer {
    private jackpotInfo: gc.NotificationServiceMessage.JackpotWinner = null;

    onLoad(): void {
        super.onLoad();
    }

    onDestroy(): void {
        super.onDestroy();
    }

    @render(Notification.JackpotWinnerStore, (store) => store.jackpotWinner, { fireImmediately: false })
    async showNotification(jackpotInfo: gc.NotificationServiceMessage.JackpotWinner) {
        this.jackpotInfo = jackpotInfo;
        const prefab = await bundleManager.loadSharedAsset<Prefab>(`prefabs/jackpot-notification`, Prefab);
        try {
            const remoteGameName = await FunctionUtils.getRemoteDisplayGameName(this.jackpotInfo.gameId);
            if (prefab) {
                const node = instantiate(prefab);
                this.node.addChild(node);
                const jackpotNotificationCmp = node.getComponent(JackpotNotification);
                jackpotNotificationCmp.setData(this.jackpotInfo.winnerName, this.jackpotInfo.amount, remoteGameName);
            }
        } catch (e) {
            console.error("An error occurred in registerEventGetGameName:", e);
        }

        this.jackpotInfo = null;
    }
}
