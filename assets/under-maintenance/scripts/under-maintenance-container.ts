import gc from "@sg/game-client-base";
import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { bundleManager } from "../../shared/common-components/bundle-manager/bundle-manager";
const { ccclass, property } = _decorator;
const { Shared } = gc;

@ccclass
export default class UnderMaintenanceContainer extends Component {
    @property(Node)
    container: Node = null;

    onLoad() {
        const sessionInfo = Shared.utils.StorageManager.get(Shared.utils.localStorageKeys.portraitDirectMode) as gc.App.IPortraitDirectMode;
        const isPortraitDirectMode = sessionInfo?.isPortraitDirectMode ?? false;

        this.loadPrefab(isPortraitDirectMode);
    }

    async loadPrefab(isPortraitDirectMode: boolean) {
        let prefab = null;
        if (isPortraitDirectMode) {
            prefab = await bundleManager.loadPortraitDirectSharedAsset<Prefab>(`under-maintenance/under-maintenance`, Prefab);
        } else {
            prefab = await bundleManager.loadSharedAsset<Prefab>(`under-maintenance/under-maintenance`, Prefab);
        }
        try {
            if (prefab) {
                const node = instantiate(prefab);
                this.container.addChild(node);
            }
        } catch (e) {}
    }
}
