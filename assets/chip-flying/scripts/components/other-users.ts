import { _decorator } from "cc";
import Observer from "observer";
import { ChipFlyingHandlers } from "db://shared-components/chip-flying/scripts/handlers/chip-flying-handler";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";

const { useObserver, handle } = Observer;

const { ccclass } = _decorator;

@ccclass
export default class OtherUsers extends ObserverComponent {
    onLoad() {
        super.onLoad();
        this.setOtherUsers();
    }

    @handle(ChipFlyingHandlers.SetOtherUsers)
    setOtherUsers() {
        return this.node;
    }
}
