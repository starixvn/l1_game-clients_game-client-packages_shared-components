import { _decorator, Component } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../utils";

const { ccclass, property } = _decorator;
const { useObserver } = Observer;

@ccclass
export class ObserverComponent extends Component {
    private dispose: Function;

    onLoad(): void {
        this.dispose = useObserver(this, FunctionUtils.getNamespace());
    }

    protected onDestroy(): void {
        this.dispose();
    }
}
