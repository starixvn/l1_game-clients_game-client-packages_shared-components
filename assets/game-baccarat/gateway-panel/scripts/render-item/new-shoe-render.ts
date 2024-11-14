import { _decorator, sp } from "cc";
import { AnimationUtils } from "../../../../shared/utils/utils";
import { EmitterEvents, Store } from "../models/definitions";
import { GameData } from "../models/game-data";
import RenderItem from "./render-item";
const { ccclass, property } = _decorator;

@ccclass
export default class NewShoeRender extends RenderItem {
    private _gameData: GameData = null;

    init(data: GameData) {
        this.node.active = false;

        this._gameData = data;
        const store = data.getStore(Store.GameInfo);
        store?.addListener(EmitterEvents.StartRound, this.onStartRound);
        store?.addListener(EmitterEvents.ActiveNewShoe, this.onActiveNewShoe);

        store?.wakeUp();
    }

    onDestroy() {
        const store = this._gameData?.getStore(Store.GameInfo);
        store?.removeListener(EmitterEvents.StartRound, this.onStartRound);
        store?.removeListener(EmitterEvents.ActiveNewShoe, this.onActiveNewShoe);
    }

    onActiveNewShoe = async (show: boolean) => {
        this.node.active = show;
        if (!show) {
            return;
        }
        try {
            const spine = this.getComponentInChildren(sp.Skeleton);
            await AnimationUtils.playSpine(spine, "in", false);
            spine.setAnimation(0, "shuffling", true);
        } catch (e) {}
    };
    onStartRound = async () => {
        if (this.node.active) {
            try {
                const spine = this.getComponentInChildren(sp.Skeleton);
                await AnimationUtils.playSpine(spine, "out", false);
            } catch (e) {}
            this.node.active = false;
        }
    };
}
