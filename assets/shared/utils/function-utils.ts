import { find } from "cc";
import { GameComponentBase } from "../../game/scripts/components/game-component-base";

export namespace FunctionUtils {
    export const getNamespace = () => {
        const namespace = find("Canvas").getComponent(GameComponentBase)?.namespace;
        return namespace || "default";
    };
}
