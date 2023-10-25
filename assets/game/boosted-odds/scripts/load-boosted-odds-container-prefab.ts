import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { bundleManager } from "../../../shared/common-components/bundle-magager/bundle-manager";
import { FunctionUtils } from "../../../shared/utils";

const { ccclass } = _decorator;
const { handle, render } = Observer;

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
            let prefabPath = model.isInstantVersion ? "shared-instant-bundle" : "shared-bundle";
            let subpath = "";
            if (model.isInstantVersion) {
                subpath += FunctionUtils.isPortraitMode() ? "/portrait" : "/landscape";
            }

            const prfBoostedOddContainer = await bundleManager.loadAssetsFromBundle<Prefab>(
                prefabPath,
                `boosted-odds${subpath}/boosted-odds-container`,
                Prefab,
                null
            );
            const prfBoostedOddIcon = await bundleManager.loadAssetsFromBundle<Prefab>(
                prefabPath,
                `boosted-odds${subpath}/boosted-odds`,
                Prefab,
                null
            );

            this.node.addChild(instantiate(prfBoostedOddIcon));
            this.node.addChild(instantiate(prfBoostedOddContainer));

            setTimeout(() => {
                this.handleSetBoostedOddsLoadedPrefab();
            }, 1000);
        }
    }

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers, (handler) => handler.setIsLoadedPrefab(true))
    handleSetBoostedOddsLoadedPrefab() {}
}
