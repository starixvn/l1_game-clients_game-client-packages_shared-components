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
        store?.addListener(EmitterEvents.TimeStateChange, this.onTimeStateChange);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeListener(EmitterEvents.TimeChange, this.onTimeChange);
        store?.removeListener(EmitterEvents.PlacingBet, this.onPlacingBet);
        store?.removeListener(EmitterEvents.LockingBet, this.onLockingBet);
        store?.removeListener(EmitterEvents.TimeStateChange, this.onTimeStateChange);
    }

    onTimeStateChange = (state: string) => {
        switch (state) {
            case EmitterEvents.PlacingBet:
                this.onPlacingBet();
                break;
            case EmitterEvents.LockingBet:
                this.onLockingBet();
                break;
            default:
                break;
        }
    };

    onTimeChange = (time) => {
        this.timer.setTime(time);
    };

    onLockingBet = () => {
        this.node.active = false;
    };
    onPlacingBet = () => {
        this.node.active = true;
    };
}
