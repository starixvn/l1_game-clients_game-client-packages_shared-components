import { _decorator, Component, game, Game } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../utils";

const { ccclass } = _decorator;
const { useObserver, render } = Observer;

@ccclass
export class ObserverComponent extends Component {
    private dispose: Function;
    protected observer: IntersectionObserver = null;
    protected isHideGame = false;

    onLoad(): void {
        this.dispose = useObserver(this, FunctionUtils.getNamespace());

        game.on(Game.EVENT_HIDE, this.onHide, this);
        game.on(Game.EVENT_SHOW, this.onShow, this);
        this.observer = FunctionUtils.setupIntersectionObserver(this.onShow, this.onHide);
        this.observer?.observe(game?.canvas);
    }

    onDestroy(): void {
        this.dispose();
    }

    onShow = () => {
        this.isHideGame = false;
    };

    onHide = () => {
        this?.unscheduleAllCallbacks();
        this.isHideGame = true;
    };
}
