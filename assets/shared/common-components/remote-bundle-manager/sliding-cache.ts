export interface CacheRecord {
    data: unknown;
    timeout?: NodeJS.Timeout;
    valid: boolean;
}

export default class SlidingCache {
    private store: Object | Record<string, CacheRecord> = {};

    constructor(private readonly duration: number) {}

    private get(key: string): CacheRecord {
        if (!this.store.hasOwnProperty(key)) {
            this.store[key] = {
                data: null,
                timeout: null,
                valid: false,
            };
        }

        return this.store[key];
    }

    private registerAutoClean(record: CacheRecord) {
        clearTimeout(record.timeout);

        record.timeout = setTimeout(() => {
            record.valid = false;
        }, this.duration);
    }

    public async execute(key: string, fetchData: () => Promise<unknown>) {
        const record = this.get(key);

        if (!record.valid) {
            const data = await fetchData();

            record.valid = true;
            record.data = data;
        }

        this.registerAutoClean(record);

        return record.data;
    }
}
