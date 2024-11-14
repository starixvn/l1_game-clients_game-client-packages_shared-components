import { _decorator } from "cc";
import RawTwoDigitsTimer from "../../../../game/game-timer/scripts/raw-two-digits-timer";
import { EmitterEvents, Store } from "../models/definitions";
import { GameData } from "../models/game-data";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class TimerRender extends RenderItem {
    @property(RawTwoDigitsTimer)
    timer: RawTwoDigitsTimer = null;

    private _gameData: GameData = null;

    init(data: GameData) {
        this.node.active = false;

        this._gameData = data;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.TimeChange, this.onTimeChange);
        store?.addListener(EmitterEvents.PlacingBet, this.onPlacingBet);
        store?.addListener(EmitterEvents.LockingBet, this.onLockingBet);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeListener(EmitterEvents.TimeChange, this.onTimeChange);
        store?.removeListener(EmitterEvents.StartRound, this.onPlacingBet);
        store?.removeListener(EmitterEvents.ActiveNewShoe, this.onLockingBet);
    }

    onTimeChange = async (time) => {
        this.timer.setTime(time);
    };

    onLockingBet = async () => {
        this.node.active = false;
    };
    onPlacingBet = async () => {
        this.node.active = true;
    };
}
