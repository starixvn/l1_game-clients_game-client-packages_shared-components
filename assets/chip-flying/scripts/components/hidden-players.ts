import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { HiddenPlayersHandlers } from "../handlers/hidden-players-handler";

const { handle } = Observer;

const { ccclass } = _decorator;

@ccclass
export default class HiddenPlayers extends ObserverComponent {
    onLoad() {
        super.onLoad();
        this.setHiddenPlayers();
    }

    @handle(HiddenPlayersHandlers.SetHiddenPlayers)
    setHiddenPlayers() {
        return this.node;
    }
}
