import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";

import { containerOptions, settings } from "../../../../../../assets/game/scripts/game-settings";
import { siteConfigs } from "../../../../../../assets/scripts/site-configs";
import { startGame } from "../../../shared/scripts/startup";
import GameComponent from "../../scripts/components/game-component";
import { TestHandler } from "./handlers/test-handlers";

const { ccclass, property } = _decorator;

const { observer, handle } = Observer;

startGame(settings.name, containerOptions, siteConfigs);

@ccclass()
@observer(settings.name)
export class Test extends GameComponent {
    onLoad() {
        gc.initMobxLogger();
        const configs = new gc.GameServiceMessage.GameConfigs();
        configs.chips = ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"];
        configs.minBet = 1;
        configs.maxBet = 2000;
        this.setDemoGameConfigs(configs);
    }

    @handle(TestHandler)
    setDemoGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        return gameConfigs;
    }
}
