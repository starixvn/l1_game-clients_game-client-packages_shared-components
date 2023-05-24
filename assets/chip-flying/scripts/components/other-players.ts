import { _decorator } from "cc";
import { ChipFlyingHandlers } from "db://shared-components/chip-flying/scripts/handlers/chip-flying-handler";
import Observer from "observer";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";

const { handle } = Observer;

const { ccclass } = _decorator;

@ccclass
export default class OtherPlayers extends ObserverComponent {
    onLoad() {
        super.onLoad();
        this.setOtherPlayers();
    }

    @handle(ChipFlyingHandlers.SetOtherPlayers)
    setOtherPlayers() {
        return this.node;
    }
}
