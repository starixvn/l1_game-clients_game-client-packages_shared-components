import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import { EmitterEvents, Store } from "../models/definitions";
import { GameData } from "../models/game-data";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class GameInfoRender extends RenderItem {
    @property(Label)
    labelRTP: Label = null;

    @property(Label)
    labelTotalOnlineUsers: Label = null;

    @property(Label)
    labelLimitBet: Label = null;

    private _gameData: GameData = null;
    init(data: GameData) {
        this._gameData = data;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.RtpChange, this.onChangeRTP);
        store?.addListener(EmitterEvents.TotalOnlineChange, this.onChangeTotalOnlineUser);
        store?.addListener(EmitterEvents.BetLimitChange, this.onChangeBetLimit);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeListener(EmitterEvents.RtpChange, this.onChangeRTP);
        store?.removeListener(EmitterEvents.TotalOnlineChange, this.onChangeTotalOnlineUser);
        store?.removeListener(EmitterEvents.BetLimitChange, this.onChangeBetLimit);
    }

    onChangeBetLimit = (data: { minBet: number; maxBet: number }) => {
        if (!data) {
            return;
        }
        if (this.labelLimitBet) {
            this.labelLimitBet.string = `${gc.FormatUtils.numberWithCommas(data.minBet)} - ${gc.FormatUtils.numberWithCommas(data.maxBet)}`;
        }
    };
    onChangeTotalOnlineUser = (data: number) => {
        if (!this.labelTotalOnlineUsers) {
            return;
        }
        this.labelTotalOnlineUsers.string = gc.FormatUtils.numberWithCommas(data);
    };
    onChangeRTP = (data: number) => {
        if (!this.labelRTP) {
            return;
        }
        this.labelRTP.string = `${gc.FormatUtils.numberWithCommas(data, 2)}%`;
    };
}
