import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;
const { handle } = Observer;
const { GameCrash, Shared } = gc;
const { utils } = Shared;

@ccclass
export class ProvablyFairButton extends ObserverComponent {
    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openPopup: boolean) => handle.handleClientSeedPopup(openPopup))
    onClickPFButton() {
        utils.AnalyticsManager.trackEvent(utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: utils.TrackingAction.ClickPFIcon,
            object_name: utils.PFObjectName.ProvablyFair,
            game_name: FunctionUtils.getNamespace(),
        });

        return true;
    }
}
