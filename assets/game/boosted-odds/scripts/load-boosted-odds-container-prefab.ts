import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { bundleManager } from "../../../shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../shared/utils";

const { ccclass } = _decorator;
const { handle, render } = Observer;

const BoostedOddsBundleConstants = {
    shareBundle: "shared-bundle",
    shareInstantBundle: "shared-instant-bundle",
    rootFolder: "boosted-odds",
    subPath: {
        portrait: "/portrait",
        landscape: "/landscape",
    },
    prefabs: {
        icon: "boosted-odds",
        container: "boosted-odds-container",
    },
    delayTimeForLoadContainer: 1000,
};

@ccclass("LoadBoostedOddsContainerPrefab")
export default class LoadBoostedOddsContainerPrefab extends ObserverComponent {
    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                isInstantVersion: store.isInstantVersion,
                boostedOddsCounter: store.boostedOddsCounter,
                shouldAddBoostedOddPrefab: store.shouldAddBoostedOddPrefab,
            };
        },
        { fireImmediately: false }
    )
    async addBoostedOddsContainerPrefab(model: {
        isInstantVersion: boolean;
        boostedOddsCounter: number;
        shouldAddBoostedOddPrefab: boolean;
    }) {
        if (model.shouldAddBoostedOddPrefab) {
            const { prefabs, delayTimeForLoadContainer } = BoostedOddsBundleConstants;

            const prfBoostedOddContainer = await this.getPrefabs(model.isInstantVersion, prefabs.container);
            const prfBoostedOddIcon = await this.getPrefabs(model.isInstantVersion, prefabs.icon);

            this.node.addChild(instantiate(prfBoostedOddIcon));
            this.node.addChild(instantiate(prfBoostedOddContainer));

            setTimeout(() => {
                this.handleSetBoostedOddsLoadedPrefab();
            }, delayTimeForLoadContainer);
        }
    }

    async getPrefabs(isInstantVersion: boolean, prefabName: string) {
        const { shareInstantBundle, shareBundle, subPath, rootFolder } = BoostedOddsBundleConstants;
        const prefabPath = isInstantVersion ? shareInstantBundle : shareBundle;
        let subpath = "";

        if (isInstantVersion) {
            subpath += FunctionUtils.isPortraitMode() ? subPath.portrait : subPath.landscape;
        }

        return bundleManager.loadAssetsFromBundle<Prefab>(prefabPath, `${rootFolder}${subpath}/${prefabName}`, Prefab, null);
    }

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers, (handler) => handler.setIsLoadedPrefab(true))
    handleSetBoostedOddsLoadedPrefab() {}
}
