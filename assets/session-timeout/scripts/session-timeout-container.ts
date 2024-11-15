import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { bundleManager } from "../../shared/common-components/bundle-magager/bundle-manager";

const { Shared } = gc;

const { ccclass, property } = _decorator;
@ccclass
export default class SessionTimeOutContainer extends Component {
    @property(Node)
    container: Node = null;

    protected onLoad(): void {
        const sessionInfo = Shared.utils.StorageManager.get(Shared.utils.localStorageKeys.portraitDirectMode) as gc.App.IPortraitDirectMode;
        const isPortraitDirectMode = sessionInfo?.isPortraitDirectMode ?? false;

        this.loadPrefab(isPortraitDirectMode);
    }

    protected async loadPrefab(isPortraitDirectMode: boolean) {
        let prefab = null;

        if (isPortraitDirectMode) {
            prefab = await bundleManager.loadPortraitDirectSharedAsset<Prefab>(`session-timeout/session-timeout`, Prefab);
        } else {
            prefab = await bundleManager.loadSharedAsset<Prefab>(`session-timeout/session-timeout`, Prefab);
        }
        try {
            if (prefab) {
                const node = instantiate(prefab);
                this.container.addChild(node);
            }
        } catch (e) {}
    }
}
