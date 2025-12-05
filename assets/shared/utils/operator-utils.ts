import gc from "@sg/game-client-base";

const { StorageManager, localStorageKeys } = gc;

export const OperatorAlias = {
    SP: "SabaPlay",
    VG: "VGaming",
    SG: "Saba",
    TIP88: "Tip88",
    NOVA88: "Nova88",
    "12BET": "12BET"
};

export namespace OperatorUtils {
    export const getOperatorAlias = (): string => {
        const operator = getOperator();
        return OperatorAlias[operator] || "OTHER";
    };

    export const getOperatorLowerCase = () => {
        return getOperatorAlias().toLowerCase();
    }

    function getOperator(): string {
        const operatorStorage = StorageManager.get(localStorageKeys?.operator);
        return operatorStorage ? operatorStorage.toString().toUpperCase() : "";
    }
}
