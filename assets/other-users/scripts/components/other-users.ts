import { Component, _decorator } from "cc";
import Observer from "observer";
import { ChipFlyingHandlers } from "../../../chip-flying/scripts/handlers/chip-flying-handler";
import { FunctionUtils } from "../../../utils";

const { useObserver, handle } = Observer;

const { ccclass } = _decorator;

@ccclass
export default class OtherUsers extends Component {
    private dispose: Function;

    onLoad() {
        this.dispose = useObserver(this, FunctionUtils.getNamespace());
        this.setOtherUsers();
    }

    @handle(ChipFlyingHandlers.SetOtherUsers)
    setOtherUsers() {
        return this.node;
    }

    protected onDestroy(): void {
        this.dispose();
    }
}
