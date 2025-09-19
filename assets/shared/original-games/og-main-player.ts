import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import observer from "observer";
import { ObserverComponent } from "../common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../utils";
import { ORIGINAL_GAMES_MESSAGES } from "./original-games-utils";
const { ccclass } = _decorator;
const { render } = observer;

@ccclass
export class OgMainPlayer extends ObserverComponent {
    @render(gc.Player.MainPlayerStore, (store) => ({ balance: store.balance, currency: store.currency }))
    renderBalance(data: { balance: number, currency: string }) {
        FunctionUtils.postMessageToOriginalLobby(ORIGINAL_GAMES_MESSAGES.BALANCE_UPDATE, data);
    }


}

