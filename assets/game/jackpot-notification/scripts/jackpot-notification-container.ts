import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { JackpotNotification } from "./jackpot-notification";
import { FunctionUtils } from "../../../shared/utils/function-utils";

const { render } = Observer;
const { Notification, Translator, GameConfiguration } = gc;
const { ccclass } = _decorator;

@ccclass("JackpotNotificationContainer")
export class JackpotNotificationContainer extends NodeContainer {
    private jackpotInfo: gc.NotificationServiceMessage.JackpotWinner = null;
    private gameConfigurations: gc.GameConfiguration.TGameConfiguration[] = [];

    onLoad(): void {
        super.onLoad();
    }

    onDestroy(): void {
        super.onDestroy();
    }

    @render(GameConfiguration.GameConfigurationStore, (store) => store.gameConfiguration)
    setGameConfigurations(configurations: gc.GameConfiguration.TGameConfiguration[]) {
        this.gameConfigurations = configurations;
    }

    @render(Notification.JackpotWinnerStore, (store) => store.jackpotWinner, { fireImmediately: false })
    async showNotification(jackpotInfo: gc.NotificationServiceMessage.JackpotWinner) {
        this.jackpotInfo = jackpotInfo;
        const prefab = await bundleManager.loadSharedAsset<Prefab>(`prefabs/jackpot-notification`, Prefab);
        try {
            const gameConfiguration = this.gameConfigurations.find(config => config.id === this.jackpotInfo.gameId);
            const displayGameName = await FunctionUtils.getDisplayGameName(this.jackpotInfo.gameId, gameConfiguration);
            if (prefab) {
                const node = instantiate(prefab);
                this.node.addChild(node);
                const jackpotNotificationCmp = node.getComponent(JackpotNotification);
                jackpotNotificationCmp.setData(this.jackpotInfo.winnerName, this.jackpotInfo.amount, displayGameName);
            }
        } catch (e) {
            console.error("An error occurred in registerEventGetGameName:", e);
        }

        this.jackpotInfo = null;
    }
}
