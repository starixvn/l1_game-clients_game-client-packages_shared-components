import { _decorator, Node } from "cc";
import { EmitterEvents, Store } from "../models/definitions";
import { GameData } from "../models/game-data";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class StatusGameRender extends RenderItem {
    @property({ type: Node })
    nodes: Node[] = [];

    private _gameData: GameData = null;

    init(data: GameData) {
        this._gameData = data;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.PlacingBet, this.onPlacingBet);
        store?.addListener(EmitterEvents.LockingBet, this.onLockingBet);
        store?.addListener(EmitterEvents.Settling, this.onSettling);

        const disableStore = data.getStore(Store.DisableGame);
        disableStore?.addListener(EmitterEvents.DisabledGame, this.onChangeDisabledGame);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeListener(EmitterEvents.LockingBet, this.onLockingBet);
        store?.removeListener(EmitterEvents.Settling, this.onSettling);

        const disableStore = this._gameData?.getStore(Store.DisableGame);
        disableStore?.removeListener(EmitterEvents.DisabledGame, this.onChangeDisabledGame);
    }

    onChangeDisabledGame = (data: boolean) => {
        if (data) {
            this.nodes.forEach((node) => {
                node.active = false;
            });
            return;
        }
    };

    onPlacingBet = () => {
        this.updateVisibility(EmitterEvents.PlacingBet);
    };

    onLockingBet = () => {
        this.updateVisibility(EmitterEvents.LockingBet);
    };

    onSettling = () => {
        this.updateVisibility(EmitterEvents.Settling);
    };

    updateVisibility(name: string) {
        this.nodes.forEach((node) => {
            node.active = node.name === name;
        });
    }
}
