import { _decorator, Component } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../utils";

const { ccclass } = _decorator;
const { useObserver } = Observer;

@ccclass
export class ObserverComponent extends Component {
    protected dispose: Function;

    onLoad(): void {
        this.dispose = useObserver(this, FunctionUtils.getNamespace(this.node));
    }

    onDestroy(): void {
        this.dispose();
    }
}
