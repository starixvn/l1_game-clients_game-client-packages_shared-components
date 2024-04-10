import gc from "@sg/game-client-base";

const { StorageManager, localStorageKeys } = gc;

export const OperatorAlias = {
    SP: "SP",
    VG: "VG",
    SG: "SG",
    TIP88: "TIP88",
};

export namespace OperatorUtils {
    export const getOperatorAlias = (): string => {
        const operator = getOperator();
        return OperatorAlias[operator] || "OTHER";
    };

    function getOperator(): string {
        const operatorStorage = StorageManager.get(localStorageKeys?.operator);
        return operatorStorage ? operatorStorage.toString().toUpperCase() : "";
    }
}
