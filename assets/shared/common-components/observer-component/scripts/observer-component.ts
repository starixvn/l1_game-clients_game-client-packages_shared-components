import { _decorator, Component, Game, game } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../utils";

const { ccclass } = _decorator;
const { useObserver } = Observer;

@ccclass
export class ObserverComponent extends Component {
    private dispose: Function;
    protected visibility: boolean = false;

    onLoad(): void {
        this.dispose = useObserver(this, FunctionUtils.getNamespace());
        game.on(Game.EVENT_HIDE, this.setInvisibility, this);
        game.on(Game.EVENT_SHOW, this.setVisibility, this);
    }

    protected onDestroy(): void {
        this.dispose();
        game.off(Game.EVENT_HIDE, this.setInvisibility, this);
        game.off(Game.EVENT_SHOW, this.setVisibility, this);
    }

    setInvisibility(): void {
        this.visibility = false;
    }

    setVisibility(): void {
        this.visibility = true;
    }
}
