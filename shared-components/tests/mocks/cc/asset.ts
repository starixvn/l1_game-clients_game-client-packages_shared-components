export class Asset {}

export namespace AssetManager {
    export class Bundle {
        load = jest.fn();
    }
}

export const assetManager = {
    loadBundle: jest.fn(),
};

export const log = jest.fn();
