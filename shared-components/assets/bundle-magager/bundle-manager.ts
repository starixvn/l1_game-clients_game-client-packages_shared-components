import { Asset, AssetManager, assetManager, log } from "cc";

export class BundleManager {
    private static _instance: BundleManager;
    public static getInstance(): BundleManager {
        if (!this._instance) {
            this._instance = new BundleManager();
        }
        return this._instance;
    }
    private bundles = {};
    async loadBundle(name: string): Promise<AssetManager.Bundle> {
        if (this.bundles[name]) {
            return this.bundles[name];
        }

        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    log("Can not load bundle ", name);
                    resolve(null);
                    return;
                }
                this.bundles[name] = bundle;
                resolve(bundle);
            });
        });
    }

    async loadAssetsFromBundle<AssetType extends Asset>(
        bundleName: string,
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null
    ) {
        const bundle = await this.loadBundle(bundleName);
        if (bundle) {
            return new Promise<AssetType>((resolve) => {
                bundle.load(assetPath, assetType, onProgress, (err, asset) => {
                    if (err) {
                        log(`Can not load assset ${assetPath} from bundle ${bundleName}`);
                        resolve(null);
                        return;
                    }

                    resolve(asset as AssetType);
                });
            });
        }
    }

    loadSharedAsset<AssetType extends Asset>(
        assetPath: string,
        assetType: any,
        onProgress: ((finished: number, total: number) => void) | null = null
    ) {
        return this.loadAssetsFromBundle<AssetType>("shared-bundle", assetPath, assetType, onProgress);
    }
}

export const bundleManager = BundleManager.getInstance();
