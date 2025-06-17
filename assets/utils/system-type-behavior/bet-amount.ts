export function getBetAmountBaseOnSystemType(betStoreAmount: number, socketAmount: number): number {
    return window.envConfig.systemType === "HD" 
        ? betStoreAmount 
        : socketAmount;
}