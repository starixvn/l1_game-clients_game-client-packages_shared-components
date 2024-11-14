import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";

import { EmitterEvents, Store } from "../models/definitions";
import { GameData } from "../models/game-data";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class ConnectionErrorRender extends RenderItem {
    private _gameData: GameData = null;

    init(data: GameData) {
        this.node.active = false;

        this._gameData = data;
        const store = data.getStore(Store.DisableGame);
        store?.addListener(EmitterEvents.ConnectionFailed, this.onChangeConnectionFailed);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.DisableGame);
        store?.removeListener(EmitterEvents.ConnectionFailed, this.onChangeConnectionFailed);
    }

    onChangeConnectionFailed = (isFailed: boolean) => {
        this.node.active = isFailed;

        const label = this.getComponentInChildren(Label);
        if (label) {
            const errorCode = "SB0010";
            const key = gc.ErrorUtils.parseErrorCode(errorCode);
            label.string = gc.Translator.translate(key, { errorCode });
        }
    };
}
