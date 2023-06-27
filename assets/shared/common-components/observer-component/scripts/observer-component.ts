import { _decorator, Component } from "cc";
import Observer from "observer";

const { ccclass } = _decorator;
const { useObserver } = Observer;

@ccclass
export class ObserverComponent extends Component {
    private dispose: Function;

    onLoad(): void {
        this.dispose = useObserver(this, window.envConfig.mainObserver);
    }

    protected onDestroy(): void {
        this.dispose();
    }
}
