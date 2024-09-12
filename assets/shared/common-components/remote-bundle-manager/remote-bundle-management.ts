import { assetManager as assetManagerCC } from "cc";
import SlidingCache from "./sliding-cache";

interface IAdapter<T> {
    (): T;
}

interface IListener {
    onVersionChanged(oldVersion: string, newVersion: string): void;
}

interface IBundle {
    load<T>(
        path: string,
        type: unknown,
        onProgress: (finish: number, total: number) => void,
        onComplete: (error: Error, asset: T) => void
    ): void;
}

interface IAssetManager {
    loadBundle(nameOrUrl: string, options: Record<string, any>, onComplete: (err: Error, bundle: IBundle) => void): void;
}

interface IBundleManagerAdapters {
    http?: IAdapter<{ get: <TResult>(url: string) => Promise<TResult> }>;
    assetManager?: IAdapter<IAssetManager>;
}

interface ILoadAssetOptions {
    bundleId: string;
    path: string;
    type: unknown;
    pathForDevMode?: string;
    onProgress?: (finish: number, total: number) => void;
}

declare global {
    const CC_EDITOR: boolean;

    export interface Window {
        bundleManagement: {
            bundles?: Record<string, { name: string; url: string; useMd5Cache: boolean; dependencies?: string[] }>;
        };
    }
}

interface IBundleManagerOptions {
    adapters: IBundleManagerAdapters;
    listeners?: IListener[];
    cacheDuration?: number;
}

export class RemoteBundleManager {
    private readonly listeners: IListener[];
    private readonly adapters: IBundleManagerAdapters;
    private readonly versions: Record<string, string>;
    private static instance: RemoteBundleManager;
    private readonly cache: SlidingCache;

    constructor(options: IBundleManagerOptions) {
        this.listeners = options.listeners || [];
        this.adapters = options.adapters;
        this.versions = {};
        this.cache = new SlidingCache(options.cacheDuration || 30000);
    }

    public static initialize(options: IBundleManagerOptions) {
        if (!RemoteBundleManager.instance) {
            RemoteBundleManager.instance = new RemoteBundleManager(options);
        }
    }

    public static getInstance(options?: IBundleManagerOptions) {
        if (!RemoteBundleManager.instance) {
            RemoteBundleManager.initialize(options);
        }

        return RemoteBundleManager.instance;
    }

    public getBundleInfo(id: string) {
        const bundleInfos = window.bundleManagement.bundles;

        if (!bundleInfos?.[id]) {
            throw new Error(`Not found bundle '${id}'.`);
        }

        return bundleInfos?.[id];
    }

    public async loadBundle(bundleId: string): Promise<IBundle> {
        if (CC_EDITOR) {
            // In development mode, all assets will be put in the resources bundle.
            return new Promise<IBundle>((resolve, reject) => {
                const defaultBundle = "resources";
                assetManagerCC?.loadBundle(defaultBundle, null, (error, resource) => {
                    error ? reject(error) : resolve(resource);
                });
            });
        }

        const assetManager = this.adapters.assetManager();
        const { name, url, useMd5Cache, dependencies } = this.getBundleInfo(bundleId);
        const bundleUrl = `${url}/${name}`;

        if (useMd5Cache) {
            await this.compareAndUpdateNewVersion(bundleId);
        }

        if (dependencies?.length) {
            await Promise.all(dependencies.map((id: string) => this.loadBundle(id)));
        }

        return new Promise<IBundle>((resolve, reject) => {
            const version = this.versions[name];

            assetManager.loadBundle(bundleUrl, { version }, (error, bundle) => {
                error ? reject(error) : resolve(bundle);
            });
        });
    }

    public async loadAsset<T>(options: ILoadAssetOptions): Promise<T> {
        if (!options.path || !options.type || !options?.bundleId) {
            throw new Error(`Invalid arguments: ${options}`);
        }

        const { bundleId, path, type, onProgress } = options;
        const bundle = await this.loadBundle(bundleId);
        const assetPath = CC_EDITOR ? options.pathForDevMode : path;

        return new Promise<T>((resolve, reject) => {
            bundle.load<T>(assetPath, type, onProgress, (error, asset) => {
                error ? reject(error) : resolve(asset);
            });
        });
    }

    protected async compareAndUpdateNewVersion(bundleId: string) {
        const { name, url } = this.getBundleInfo(bundleId);
        const http = this.adapters.http();
        const versionUrl = `${url}/versions.json?v=${Date.now()}`;
        const getVersion = () => http.get<Record<string, string>>(versionUrl);
        const versions = await this.cache.execute(url, getVersion);

        const oldVersion = this.versions[name];
        const currentVersion = versions[name];
        const difference = currentVersion && currentVersion !== oldVersion;

        if (difference) {
            this.versions[name] = currentVersion;
            this.listeners.forEach((listener) => listener.onVersionChanged(oldVersion, currentVersion));
        }
    }
}
