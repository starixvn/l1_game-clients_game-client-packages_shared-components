import { _decorator, Asset, Component, JsonAsset, log, sp, SpriteAtlas, SpriteFrame } from "cc";
import { getLocalizedPath, getSpritePath } from "db://i18n/localized-utils";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
const { ccclass, property } = _decorator;

interface PreloadConfig {
    localized: {
        [bundleName: string]: {
            [pathType: string]: string[];
        }; // values are sprite names
    };
    others: {
        [bundleName: string]: string[]; // values are assets paths
    };
}

@ccclass("PreloadAssets")
export class PreloadAssets extends Component {
    @property(JsonAsset)
    config: JsonAsset = null;

    @property
    manualLoad = true;

    onLoad(): void {
        if (!this.manualLoad) {
            this.preloadAssets();
        }
    }

    async preloadAssets(onProgress?: (progress: number) => void) {
        if (!this.config) {
            return;
        }

        const info = this.config.json as PreloadConfig;
        const { others, localized } = info;
        log(`preload asset start ---------------------- `);

        const allAssets = [];
        this.addOthersAssets(others, allAssets);

        this.addLocalizedAssets(localized, allAssets);

        const totalAssets = allAssets.length;
        let loadedAssets = 0;
        for (const asset of allAssets) {
            const { type, bundleName, path } = asset;
            log(`preload asset ${bundleName} --- ${path}`);
            await bundleManager.loadAssetsFromBundle(bundleName, path, type, null, true);
            loadedAssets++;
            onProgress && onProgress(loadedAssets / totalAssets);
        }
        log(`preload asset end   ---------------------- `);
    }

    private addLocalizedAssets(localized: { [bundleName: string]: { [pathType: string]: string[] } }, allAssets: any[]) {
        for (const bundleName of Object.keys(localized)) {
            const data = localized[bundleName];
            for (const pathType of Object.keys(data)) {
                const sprites = data[pathType];
                for (const spriteName of sprites) {
                    const isAtlas = spriteName.includes("atlas");
                    if (isAtlas) {
                        const path = getLocalizedPath(pathType, "i18n-images", spriteName);
                        allAssets.push({
                            type: SpriteAtlas,
                            bundleName,
                            path,
                        });
                    } else {
                        const spritePath = getSpritePath(pathType, "i18n-images", spriteName);
                        allAssets.push({
                            type: SpriteFrame,
                            bundleName,
                            path: spritePath,
                        });
                    }
                }
            }
        }
    }

    private addOthersAssets(others: { [bundleName: string]: string[] }, allAssets: any[]) {
        for (const bundleName of Object.keys(others)) {
            const paths = others[bundleName];
            for (const path of paths) {
                allAssets.push({
                    type: path.includes("spine") ? sp.SkeletonData : Asset,
                    bundleName,
                    path,
                });
            }
        }
    }
}
