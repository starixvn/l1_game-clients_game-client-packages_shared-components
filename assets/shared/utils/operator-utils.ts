import gc from "@sg/game-client-base";


const { StorageManager, localStorageKeys } = gc;

export namespace OperatorUtils {
    export const isSabaPlay = (): boolean => {
        const operator = StorageManager.get(localStorageKeys?.operator);
        return operator.toString().toUpperCase() === "SP";
    };

    export const getLogoByOperator = (): string => {
        const opStorage = StorageManager.get(localStorageKeys?.operator).toString().toUpperCase();
        const operator = OperatorAlias.hasOwnProperty(opStorage) ? OperatorAlias[opStorage] : "Other";
        return `logo-${operator}`;
    };

    export const getBackCardByOperator = (): string => {
        const opStorage = StorageManager.get(localStorageKeys?.operator).toString().toUpperCase();
        const operator = OperatorAlias.hasOwnProperty(opStorage) ? `-${OperatorAlias[opStorage]}` : "";
        return `back${operator}`;
    };

    export const OperatorAlias = {
        SP: "SP",
        VG: "VG",
        SG: "SG",
    };

    export const getOperatorAlias = ():string=>{
        const opStorage = StorageManager.get(localStorageKeys?.operator).toString().toUpperCase();
        return OperatorAlias.hasOwnProperty(opStorage) ? OperatorAlias[opStorage] : "Other";
    }
}
